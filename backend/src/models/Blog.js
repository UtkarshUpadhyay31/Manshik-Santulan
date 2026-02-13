import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    content: {
        type: String,
        required: [true, 'Please add content']
    },
    author: {
        type: String,
        required: [true, 'Please add an author']
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: ['Mental Health', 'Self-Care', 'Resilience', 'Mindfulness', 'Stress Management']
    },
    tags: [String],
    image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800'
    },
    readTime: {
        type: String,
        default: '5 min'
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    likes: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export default mongoose.model('Blog', BlogSchema);
