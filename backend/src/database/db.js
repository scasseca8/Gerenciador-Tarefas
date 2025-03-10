import mongoose from "mongoose";



async function connectDataBase() {
    await mongoose
        .connect(
            "mongodb+srv://scasseca:Santiago2024@cluster0.6dajq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
        )
}

export default connectDataBase