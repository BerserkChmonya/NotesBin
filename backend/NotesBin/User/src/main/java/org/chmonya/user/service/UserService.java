package org.chmonya.user.service;

import org.chmonya.user.entities.User;
import lombok.RequiredArgsConstructor;
import org.chmonya.user.dto.ReqRes;
import org.chmonya.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
@RequiredArgsConstructor
@Service
public class UserService {
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JWTUtils jwtUtils;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private EmailService emailService;

    public ReqRes register(ReqRes regRequest) {
        ReqRes resp = new ReqRes();
        if (regRequest.getName().length() < 4 || regRequest.getPassword().length() < 4){
            resp.setStatusCode(400);
            resp.setMessage("Name and password must be at least 4 characters");
            return resp;
        }

        try {
            Matcher matcher = EMAIL_PATTERN.matcher(regRequest.getEmail());
            if (!matcher.matches()) {
                resp.setStatusCode(400);
                resp.setMessage("Invalid email format");
                return resp;
            }

            User user = new User();
            user.setEmail(regRequest.getEmail());
            user.setName(regRequest.getName());
            user.setRole(regRequest.getRole());
            user.setPassword(passwordEncoder.encode(regRequest.getPassword()));
            user.setEmailVerified(false);
            if (userRepository.findByName(user.getName()).isPresent()) {
                resp.setStatusCode(400);
                resp.setMessage("User already exists");
                return resp;
            }
    //  feature is unavailable(((
//            if (!emailService.validateEmailAddress(user.getEmail())) {
//                resp.setStatusCode(400);
//                resp.setMessage("Email does not exists");
//                return resp;
//            }

            User userResult= userRepository.save(user);

            if (userResult.getId()>0) {
                resp.setUser(userResult);
                resp.setMessage("User registered successfully");
                resp.setStatusCode(200);
                emailService.sendVerificationEmail(user.getEmail(), jwtUtils.generateToken(user));
            }
        }
        catch (Exception e) {
            resp.setStatusCode(500);
            resp.setMessage(e.getMessage());
        }
        return resp;
    }

    public ReqRes login(ReqRes loginRequest) {
        ReqRes resp = new ReqRes();
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getName(),
                    loginRequest.getPassword()));
            var user = userRepository.findByName(loginRequest.getName()).orElseThrow();
            var token = jwtUtils.generateToken(user);
            var refreshToken = jwtUtils.generateRefreshToken(user, new HashMap<>());
            resp.setStatusCode(200);
            resp.setToken(token);
            resp.setRefreshToken(refreshToken);
            resp.setExpirationTime("24Hrs");
            resp.setMessage("Login successful");
        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setMessage(e.getMessage());
        }
        return resp;
    }

    public boolean verifyEmail(String token) {
        String name = jwtUtils.extractUsername(token);
        User user;
        try {
            user = userRepository.findByName(name).orElseThrow();
        } catch (Exception e) {
            return false;
        }
        if (user.isEmailVerified()) {
            return true;
        }
        user.setEmailVerified(true);
        userRepository.save(user);
        return true;
    }

    public void pswdResetEmail(String email) {
        try {
            User user = userRepository.findByEmail(email).orElseThrow();
            String token = jwtUtils.generateToken(user);
            emailService.sendPasswordResetEmail(email, token);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Error occurred: " + e.getMessage());
        }
    }

    public void updatePassword(String token, String password) {
        if (password.length() < 4) {
            throw new RuntimeException("Password must be at least 4 characters");
        }
        String name = jwtUtils.extractUsername(token);
        User user = userRepository.findByName(name).orElseThrow();
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
    }

    public ReqRes refreshToken(ReqRes refreshTokenRequest){
        ReqRes response = new ReqRes();
        try{
            String ourName = jwtUtils.extractUsername(refreshTokenRequest.getToken());
            User users = userRepository.findByName(ourName).orElseThrow();
            if (jwtUtils.isTokenValid(refreshTokenRequest.getToken(), users)) {
                var jwt = jwtUtils.generateToken(users);
                response.setStatusCode(200);
                response.setToken(jwt);
                response.setRefreshToken(refreshTokenRequest.getToken());
                response.setExpirationTime("24Hr");
                response.setMessage("Successfully Refreshed Token");
            }
            response.setStatusCode(200);
            return response;

        }catch (Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
            return response;
        }
    }


    public ReqRes getAllUsers() {
        ReqRes reqRes = new ReqRes();

        try {
            List<User> result = userRepository.findAll();
            if (!result.isEmpty()) {
                reqRes.setUsers(result);
                reqRes.setStatusCode(200);
                reqRes.setMessage("Successful");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("No users found");
            }
            return reqRes;
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred: " + e.getMessage());
            return reqRes;
        }
    }


    public ReqRes getUsersById(Integer id) {
        ReqRes reqRes = new ReqRes();
        try {
            User usersById = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User Not found"));
            reqRes.setUser(usersById);
            reqRes.setStatusCode(200);
            reqRes.setMessage("Users with id '" + id + "' found successfully");
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred: " + e.getMessage());
        }
        return reqRes;
    }


    public ReqRes deleteUser(Integer userId) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isPresent()) {
                userRepository.deleteById(userId);
                reqRes.setStatusCode(200);
                reqRes.setMessage("User deleted successfully");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for deletion");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while deleting user: " + e.getMessage());
        }
        return reqRes;
    }

    public ReqRes updateUser(Integer userId, ReqRes updatedUser) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isPresent()) {
                User existingUser = userOptional.get();
                existingUser.setEmail(updatedUser.getEmail());
                existingUser.setName(updatedUser.getName());
                existingUser.setRole(updatedUser.getRole());

                // Check if password is present in the request
                if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                    // Encode the password and update it
                    existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
                }

                User savedUser = userRepository.save(existingUser);
                reqRes.setUser(savedUser);
                reqRes.setStatusCode(200);
                reqRes.setMessage("User updated successfully");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for update");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while updating user: " + e.getMessage());
        }
        return reqRes;
    }


    public ReqRes getMyInfo(String name){
        ReqRes reqRes = new ReqRes();
        try {
            Optional<User> userOptional = userRepository.findByName(name);
            if (userOptional.isPresent()) {
                reqRes.setUser(userOptional.get());
                reqRes.setStatusCode(200);
                reqRes.setMessage("successful");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for update");
            }

        }catch (Exception e){
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while getting user info: " + e.getMessage());
        }
        return reqRes;

    }

}
