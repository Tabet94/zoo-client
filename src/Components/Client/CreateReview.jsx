import React from "react";
import { useMutation } from "@tanstack/react-query";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import reviewService from "../../Services/reviewService";

// Validation Schema using Yup
const ReviewSchema = Yup.object().shape({
  pseudo: Yup.string()
    .required("Pseudo is required")
    .min(3, "Pseudo must be at least 3 characters"),
  comment: Yup.string()
    .required("Comment is required")
    .min(10, "Comment must be at least 10 characters"),
});

const CreateReview = () => {
  const toast = useToast();

  // React Query Mutation
  const mutation = useMutation({
    mutationFn: reviewService.createReview,
    onSuccess: () => {
      toast({
        title: "Review Created",
        description: "Your review has been successfully created.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error || "Failed to create the review.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  // Form Submission Handler
  const handleSubmit = (values, actions) => {
    mutation.mutate(values, {
      onSettled: () => {
        actions.setSubmitting(false);
        actions.resetForm();
      },
    });
  };

  return (
    <Box
      maxW="500px"
      mx="auto"
      p="6"
      boxShadow="lg"
      borderRadius="md"
      bg="white"
    >
      <Formik
        initialValues={{ pseudo: "", comment: "" }}
        validationSchema={ReviewSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            {/* Pseudo Field */}
            <Field name="pseudo">
              {({ field, form }) => (
                <FormControl
                  isInvalid={form.errors.pseudo && form.touched.pseudo}
                  mb="4"
                >
                  <FormLabel>Pseudo</FormLabel>
                  <Input {...field} placeholder="Enter your pseudo" />
                  <FormErrorMessage>{form.errors.pseudo}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            {/* Comment Field */}
            <Field name="comment">
              {({ field, form }) => (
                <FormControl
                  isInvalid={form.errors.comment && form.touched.comment}
                  mb="4"
                >
                  <FormLabel>Comment</FormLabel>
                  <Textarea
                    {...field}
                    placeholder="Enter your comment"
                    resize="vertical"
                  />
                  <FormErrorMessage>{form.errors.comment}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            {/* Submit Button */}
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isSubmitting || mutation.isLoading}
              width="full"
            >
              Submit Review
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default CreateReview;
