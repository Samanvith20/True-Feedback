"use client"

import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { verifySchema } from '@/schemas/verifyEmailSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

import { useForm } from 'react-hook-form'
import {z} from "Zod"

const Verifycode = () => {
    const router=useRouter()
    const params=useParams()
    
    const {toast}=useToast()

    //Zod implementation
     const form= useForm<z.infer<typeof verifySchema>>({
        resolver:zodResolver(verifySchema),
     })

     const onSubmit=async(data:z.infer<typeof verifySchema>)=>{
            console.log(data)
            try {
                  const res=await axios.post("/api/verifyCode/",
                    {
                        code:data.code,
                        username:params.username
                    },
                 )
                 router.replace("/signin")
                
               toast({
                     title:"Success",
                     description:res.data.message,
                    })
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                 toast({
                title: 'Verification Failed',
                   description:
               axiosError.response?.data.message ??
                     'An error occurred. Please try again.',
                        variant: 'destructive',
                });
    }
            }


     


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Verify Your Account
        </h1>
        <p className="mb-4">Enter the verification code sent to your email</p>
      </div>
      <Form {...form}>
        <form 
        onSubmit=
        {form.handleSubmit(onSubmit)} 
        className="space-y-7">
          <FormField
            name="code"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <Input {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Verify</Button>
        </form>
      </Form>
    </div>
  </div>
  )

}
export default Verifycode
