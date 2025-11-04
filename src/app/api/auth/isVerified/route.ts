import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { emailRegex } from "@/constants/email-schema";

export async function POST(req:NextRequest) {
    const {email} = await req.json();
    if (!email){
        return NextResponse.json({message : "Не передан Email"}, {status : 400});
    };
    if (!emailRegex.test(email)){
        return NextResponse.json({message : "Email не валиден"}, {status : 400})
    }
    try{
        const payload = await getPayload({config});
        const rez = await payload.find({collection : "users", 
            where : {email : {equals : email}},
            req
        })
        const user = rez.docs[0];
        if (!user){
            return NextResponse.json({message : "Пользователь не найлен"}, {status : 404})
        }
        const isVerifited = user._verified;
        if (!isVerifited){
            return NextResponse.json({message : "Не верифицирован"}, {status : 403});
        }
        return NextResponse.json({message : "Пользовать верифицировлся"}, {status : 200})

    }
    catch(e){
        console.log(e);
        return NextResponse.json({message : "Internal Error"}, {status : 500})
    }
}
