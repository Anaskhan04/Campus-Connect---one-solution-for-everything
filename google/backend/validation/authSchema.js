const { z } = require('zod');

const baseSignupBodySchema = {
  username: z.string().min(3, 'Username must be at least 3 characters').max(30),
  password: z.string().min(6, 'Password must be at least 6 characters'),
};

const publicSignupSchema = z.object({
  body: z.object({
    ...baseSignupBodySchema,
    role: z.enum(['student', 'faculty'], {
      errorMap: () => ({ message: 'Please select a valid role' }),
    }),
  }),
});

const adminSignupSchema = z.object({
  body: z.object({
    ...baseSignupBodySchema,
    role: z
      .enum(['student', 'faculty', 'admin'], {
        errorMap: () => ({ message: 'Invalid role' }),
      })
      .optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
    role: z.string().min(1, 'Role is required'),
  }),
});

// New Schemas
const eventSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(100),
    description: z.string().min(1).max(1000),
    date: z.string().min(1),
    time: z.string().optional(),
    location: z.string().optional(),
    organizer: z.string().min(1),
  }),
});

const complaintSchema = z.object({
  body: z.object({
    category: z.string().min(1),
    subCategory: z.string().optional(),
    subject: z.string().min(1).max(200),
    description: z.string().min(1).max(2000),
  }),
});

const complaintStatusSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'in-progress', 'resolved', 'closed']),
  }),
});

const noticeSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200),
    tag: z.string().min(1),
    date: z.string().optional(),
    attachment: z.string().optional(),
    attachmentName: z.string().optional(),
  }),
});

const alumniSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    branch: z.string().min(1),
    year: z
      .number()
      .int()
      .min(1950)
      .max(new Date().getFullYear() + 5),
    currentRole: z.string().min(1),
    company: z.string().min(1),
    email: z.string().email(),
    linkedin: z.string().url().optional().or(z.string().length(0)),
  }),
});

const attendanceSchema = z.object({
  body: z.object({
    username: z.string().min(1),
    subjectId: z.string().min(1),
    subjectName: z.string().min(1),
    date: z.string().min(1),
    status: z.enum(['attended', 'missed', 'cancelled']),
  }),
});

const studentProfileSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    rollNo: z.string().min(1),
    year: z.string().min(1),
    branch: z.string().min(1),
    intro: z.string().optional(),
    skills: z.array(z.string()).optional(),
    email: z.string().email(),
    linkedin: z.string().url().optional().or(z.string().length(0)),
    github: z.string().url().optional().or(z.string().length(0)),
  }),
});

const facultyProfileSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    designation: z.string().min(1),
    branch: z.string().min(1),
    research: z.string().optional(),
    email: z.string().email(),
  }),
});

const todoSchema = z.object({
  body: z.object({
    text: z.string().min(1).max(500),
    completed: z.boolean().optional(),
  }),
});

const resourceSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(100),
    description: z.string().min(1).max(500),
    branch: z.string().min(1),
    year: z.string().min(1),
    fileName: z.string().min(1),
    fileData: z.string().min(1),
  }),
});

const validateSignup = (req, res, next) => {
  try {
    const schema = req.user?.role === 'admin' ? adminSignupSchema : publicSignupSchema;
    const result = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    // Directly assign the body from the result to avoid any nested property confusion
    req.body = result.body;
    next();
  } catch (err) {
    console.error('Signup validation error:', err.errors || err);
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid request data',
      details: err.errors?.map(e => e.message) ?? [err.message]
    });
  }
};

const validate = (schema) => (req, res, next) => {
  try {
    console.log('Validating request body:', req.body);
    const result = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    console.log('Validation successful, result body:', result.body);
    req.body = result.body;
    next();
  } catch (err) {
    console.error('Validation error details:', err.errors || err);
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid request data',
      details: err.errors?.map(e => e.message) ?? [err.message]
    });
  }
};

module.exports = {
  validateSignup,
  loginSchema,
  eventSchema,
  complaintSchema,
  complaintStatusSchema,
  noticeSchema,
  alumniSchema,
  attendanceSchema,
  studentProfileSchema,
  facultyProfileSchema,
  todoSchema,
  resourceSchema,
  validate,
};
