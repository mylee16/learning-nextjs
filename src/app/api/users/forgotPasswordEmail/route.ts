import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/helpers/mailer";


connect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const {email} = reqBody;
        console.log(reqBody);

        // check if user already exists
        const user = await User.findOne({email})
        if (!user) {
            return NextResponse.json({error: 'User does not exists!'},
            {status: 400})
        }

        // send forgot password email
        await sendEmail({email, emailType: "RESET", userId: user._id})

        return NextResponse.json({message: 'Forgot password email sent'}, {status: 200})
    
    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}
