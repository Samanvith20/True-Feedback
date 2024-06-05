"use client"

import { useForm } from "react-hook-form"
import {z} from "zod"
import { zodResolver } from '@hookform/resolvers/zod';
import {  useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import Link from "next/link";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { signInSchema } from "@/schemas/signInSchema"

 export default function SignInForm() {
    
const router = useRouter();
const { toast } = useToast();

    const form =   useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            
            identifier: "",
            password: ""
        }
    });

    

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
         try {
             const result=await signIn('credentials', {
              redirect: false,
              identifier: data.identifier,
              password: data.password,
            })
            console.log(result);
            
            if(result?.error){
               toast({
                title: 'Error',
                description: result.error,
                })
            }
            router.replace('/dashboard')

         } catch (error) {
            console.error('An error occurred while signin ', error);
            toast({
                title: 'Error',
                description: 'An error occurred while signin',
                })
         }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join True Feedback
                    </h1>
                    <p className="mb-4">Sign up to start your anonymous adventure</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        
                        <FormField
                            name="identifier"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email/username</FormLabel>
                                    <Input {...field} />
                                    <p className='text-muted text-gray-400 text-sm'>We will send you a verification code</p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <Input type="password" {...field} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className='w-full' >
                           signIn
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                    Not a member yet?{' '}
                        <Link href="/signup" className="text-blue-600 hover:text-blue-800">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
