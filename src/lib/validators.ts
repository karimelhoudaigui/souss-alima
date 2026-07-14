import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8),
  programIds: z.array(z.string().min(1)).min(1)
});

export const availabilitySchema = z
  .object({
    programId: z.string().optional().nullable(),
    dayOfWeek: z.coerce.number().int().min(0).max(6).optional().nullable(),
    date: z.string().datetime().optional().nullable(),
    startTime: z.string().regex(/^\d{2}:\d{2}$/),
    endTime: z.string().regex(/^\d{2}:\d{2}$/),
    isRecurring: z.coerce.boolean().default(true)
  })
  .refine((value) => value.isRecurring ? value.dayOfWeek !== null && value.dayOfWeek !== undefined : Boolean(value.date), {
    message: "Choisir un jour récurrent ou une date ponctuelle."
  });

export const sessionCreateSchema = z.object({
  availabilityId: z.string(),
  teacherId: z.string().optional().nullable(),
  scheduledAt: z.string().datetime(),
  durationMin: z.coerce.number().int().min(10).max(120).default(20)
});

export const sessionUpdateSchema = z.object({
  status: z.enum(["PROPOSED", "CONFIRMED", "DONE", "CANCELLED", "MISSED"]),
  notes: z.string().optional(),
  surah: z.string().optional(),
  ayahFrom: z.coerce.number().int().optional(),
  ayahTo: z.coerce.number().int().optional(),
  juz: z.coerce.number().int().optional(),
  page: z.coerce.number().int().optional()
});

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10)
});
