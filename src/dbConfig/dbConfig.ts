import mongoose from 'mongoose';

export async function connect() {
    try{
        mongoose.connect(process.env.MONGO_URI!);
        const connection = mongoose.connection;
        
        connection.once('open', () => {
            console.log('MongoDB connected successfully');
        });

        connection.on('error', (err) => {
            console.log('MongoDB connection error');
            console.log(err);
            process.exit(0);
        });
    } catch(e) {
        console.log('Something goes wrong');
        console.log(e);
    }
}
