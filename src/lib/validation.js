// Client-side validation schemas (mirrors the API's zod schemas).
import { z } from "zod";

export const emailField = z.string().trim().min(1, "Email is required").email("Enter a valid email address");

export const passwordField = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be at most 72 characters")
  .regex(/[a-z]/, "Add a lowercase letter")
  .regex(/[A-Z]/, "Add an uppercase letter")
  .regex(/[0-9]/, "Add a number");

export const phoneField = z.string().trim().regex(/^\+?[0-9\s-]{8,20}$/, "Enter a valid phone number");
export const optionalPhone = z.union([z.literal(""), phoneField]);

export const loginSchema = z.object({ email: emailField, password: z.string().min(1, "Password is required") });

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
    email: emailField,
    password: passwordField,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    terms: z.literal(true, { message: "Please accept the terms to continue" }),
  })
  .refine((d) => d.password === d.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match" });

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  email: emailField,
  subject: z.string().trim().min(3, "Subject must be at least 3 characters").max(120),
  message: z.string().trim().min(20, "Message should be at least 20 characters").max(2000),
});

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  phone: optionalPhone,
  city: z.string().trim().max(60),
  address: z.string().trim().max(200),
  bio: z.string().trim().max(300, "Bio must be at most 300 characters"),
});

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordField,
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match" });

export const CITIES = ["Dhaka", "Chattogram", "Sylhet"];

export const restaurantSchema = z
  .object({
    name: z.string().trim().min(3, "Name must be at least 3 characters").max(80),
    tagline: z.string().trim().min(5, "Tagline must be at least 5 characters").max(90),
    description: z.string().trim().min(60, "Description should be at least 60 characters").max(1200),
    categoryId: z.string().min(1, "Choose a cuisine"),
    city: z.enum(CITIES, { message: "Choose a city" }),
    area: z.string().trim().min(2, "Area is required").max(60),
    address: z.string().trim().min(5, "Address is required").max(160),
    phone: phoneField,
    openingHours: z.string().trim().min(5, "Opening hours are required").max(60),
    priceLevel: z.coerce.number().int().min(1).max(3),
    avgMealPrice: z.coerce.number({ message: "Enter a number" }).int().min(50, "Must be at least ৳50").max(10000),
    deliveryFee: z.coerce.number({ message: "Enter a number" }).int().min(0, "Cannot be negative").max(500),
    minOrder: z.coerce.number({ message: "Enter a number" }).int().min(0, "Cannot be negative").max(5000),
    deliveryTimeMin: z.coerce.number({ message: "Enter a number" }).int().min(10, "At least 10 minutes").max(120),
    deliveryTimeMax: z.coerce.number({ message: "Enter a number" }).int().min(10, "At least 10 minutes").max(150),
    isVeganFriendly: z.boolean(),
    images: z.array(z.string()).min(1, "Add at least one photo").max(8, "Up to 8 photos"),
  })
  .refine((d) => d.deliveryTimeMax >= d.deliveryTimeMin, { path: ["deliveryTimeMax"], message: "Must be greater than the minimum time" });

export const menuItemSchema = z.object({
  name: z.string().trim().min(2, "Dish name is required").max(80),
  description: z.string().trim().min(10, "Description should be at least 10 characters").max(300),
  price: z.coerce.number({ message: "Enter a price" }).int().min(10, "At least ৳10").max(20000),
  section: z.string().trim().min(2, "Section is required").max(40),
  image: z.string().min(1, "Add a dish photo"),
  isAvailable: z.boolean(),
  isPopular: z.boolean(),
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1, "Choose a rating").max(5),
  comment: z.string().trim().min(10, "Review should be at least 10 characters").max(600),
});

export const checkoutSchema = z.object({
  deliveryAddress: z.string().trim().min(8, "Enter your full delivery address").max(200),
  phone: phoneField,
  note: z.string().trim().max(250, "Note must be at most 250 characters"),
  paymentMethod: z.enum(["CASH_ON_DELIVERY", "CARD", "MOBILE_WALLET"]),
});
