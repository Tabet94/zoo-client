import React from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import {
  Button,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import authService from "../../Services/authService";

const RegisterVet = () => {
  const toast = useToast();
  const navigate = useNavigate();

  // Validation schema with Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .required("Username is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // Form submission handler
  const onSubmit = async (values, { setSubmitting }) => {
    try {
      await authService.registerVet(values);
      toast({
        title: "Account created.",
        description: "You can now log in.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      navigate("/login");
    } catch (error) {
      if (error.response?.status === 403) {
        toast({
          title: "Unauthorized",
          description: "Only admins can register veterinarians.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          title: "An error occurred.",
          description: error.response?.data?.message || "Unable to create account.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <VStack spacing={4} align="stretch" maxWidth="400px" mx="auto" mt="50px">
      <Formik
        initialValues={{
          email: "",
          username: "",
          password: "",
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <FormControl isInvalid={errors.email && touched.email}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Field
                as={Input}
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.username && touched.username} mt={4}>
              <FormLabel htmlFor="username">Username</FormLabel>
              <Field
                as={Input}
                id="username"
                name="username"
                placeholder="Enter your username"
              />
              <FormErrorMessage>{errors.username}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.password && touched.password} mt={4}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Field
                as={Input}
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
              />
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>

            <Button
              mt={6}
              colorScheme="blue"
              isLoading={isSubmitting}
              type="submit"
              width="full"
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </VStack>
  );
};

export default RegisterVet;
