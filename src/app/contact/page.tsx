"use client"

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, CheckCircle, AlertCircle, Loader2, User, Mail, MessageSquare, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Alert } from '@/components/ui/alert'
import Navbar from "@/components/navbar"
import Footer  from "@/components/footer"
import "@/styles/sidebar_settings_editor.css"

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

interface ContactFormProps {
  onSubmit?: (data: FormData) => Promise<void>
  className?: string
}

const ContactForm: React.FC<ContactFormProps> = ({ 
  onSubmit = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000))
    if (Math.random() > 0.7) throw new Error('Network error')
  },
  className = ""
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  
  const formRef = useRef<HTMLFormElement>(null)

  const validateField = (name: keyof FormData, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required'
        if (value.trim().length < 2) return 'Name must be at least 2 characters'
        return undefined
      case 'email':
        if (!value.trim()) return 'Email is required'
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return 'Please enter a valid email address'
        return undefined
      case 'subject':
        if (!value.trim()) return 'Subject is required'
        if (value.trim().length < 5) return 'Subject must be at least 5 characters'
        return undefined
      case 'message':
        if (!value.trim()) return 'Message is required'
        if (value.trim().length < 10) return 'Message must be at least 10 characters'
        if (value.trim().length > 1000) return 'Message must be less than 1000 characters'
        return undefined
      default:
        return undefined
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    let isValid = true

    Object.keys(formData).forEach(key => {
      const fieldName = key as keyof FormData
      const error = validateField(fieldName, formData[fieldName])
      if (error) {
        newErrors[fieldName] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleInputChange = (name: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (touched[name]) {
      const error = validateField(name, value)
      setErrors(prev => ({ ...prev, [name]: error }))
    }
    
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle')
      setSubmitMessage('')
    }
  }

  const handleBlur = (name: keyof FormData) => {
    setTouched(prev => ({ ...prev, [name]: true }))
    const error = validateField(name, formData[name])
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      setTouched({
        name: true,
        email: true,
        subject: true,
        message: true
      })
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      await onSubmit(formData)
      setSubmitStatus('success')
      setSubmitMessage('Thank you! Your message has been sent successfully.')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTouched({})
      setErrors({})
    } catch (error) {
      setSubmitStatus('error')
      setSubmitMessage(error instanceof Error ? error.message : 'Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputVariants = {
    initial: { scale: 1 },
    focus: { scale: 1.02 },
    error: { x: [-10, 10, -10, 10, 0], transition: { duration: 0.4 } }
  }

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  }

  const FormField: React.FC<{
    name: keyof FormData
    label: string
    type?: string
    icon: React.ReactNode
    placeholder: string
    component?: 'input' | 'textarea'
  }> = ({ name, label, type = 'text', icon, placeholder, component = 'input' }) => {
    const hasError = touched[name] && errors[name]
    
    return (
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        
        <Label 
          htmlFor={name}
          className="text-sm font-medium text-foreground flex items-center gap-2"
        >
          {icon}
          {label}
        </Label>
        
        <motion.div
          variants={inputVariants}
          animate={hasError ? 'error' : 'initial'}
          whileFocus="focus"
          className="relative"
        >
          {component === 'input' ? (
            <input
              id={name}
              name={name}
              type={type}
              value={formData[name]}
              onChange={(e) => handleInputChange(name, e.target.value)}
              onBlur={() => handleBlur(name)}
              placeholder={placeholder}
              className={`h-[98%] mt-2 font-mono overflow-hidden flex w-full items-center justify-between rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 r2552esf25_252trewt3er ${
                hasError 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                  : 'border-border focus:border-primary focus:ring-primary/20'
              }`}
              aria-invalid={hasError ? 'true' : 'false'}
              aria-describedby={hasError ? `${name}-error` : undefined}
            />
          ) : (
            <textarea
              id={name}
              name={name}
              value={formData[name]}
              onChange={(e) => handleInputChange(name, e.target.value)}
              onBlur={() => handleBlur(name)}
              placeholder={placeholder}
              rows={4}
              className={`h-[98%] mt-2 font-mono overflow-hidden flex w-full items-center justify-between rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 r2552esf25_252trewt3er ${
                hasError 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                  : 'border-border focus:border-primary focus:ring-primary/20'
              }`}
              aria-invalid={hasError ? 'true' : 'false'}
              aria-describedby={hasError ? `${name}-error` : undefined}
            />
          )}
        </motion.div>
        
        <AnimatePresence mode="wait">
          {hasError && (
            <motion.div
              id={`${name}-error`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 text-sm text-red-500"
              role="alert"
              aria-live="polite"
            >
              <AlertCircle className="h-4 w-4" />
              {errors[name]}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  return (
<div>
              <Navbar />

        <div className={`w-full max-w-2xl mx-auto p-6 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-8 bg-background border-border shadow-lg">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-foreground mb-2">Get in Touch</h2>
            <p className="text-muted-foreground">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                name="name"
                label="Full Name"
                icon={<User className="h-4 w-4" />}
                placeholder="Enter your full name"
              />
              
              <FormField
                name="email"
                label="Email Address"
                type="email"
                icon={<Mail className="h-4 w-4" />}
                placeholder="Enter your email address"
              />
            </div>

            <FormField
              name="subject"
              label="Subject"
              icon={<FileText className="h-4 w-4" />}
              placeholder="What's this about?"
            />

            <FormField
              name="message"
              label="Message"
              icon={<MessageSquare className="h-4 w-4" />}
              placeholder="Tell us more about your inquiry..."
              component="textarea"
            />

            <AnimatePresence mode="wait">
              {submitStatus !== 'idle' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert className={`${
                    submitStatus === 'success' 
                      ? 'border-green-500 bg-green-50 text-green-800' 
                      : 'border-red-500 bg-red-50 text-red-800'
                  }`}>
                    {submitStatus === 'success' ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <div className="ml-2">{submitMessage}</div>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className="pt-4"
            >
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 text-base font-medium transition-all duration-200"
                aria-describedby="submit-button-description"
              >
                <AnimatePresence mode="wait">
                  {isSubmitting ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending Message...
                    </motion.div>
                  ) : (
                    <motion.div
                      key="send"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Send className="h-4 w-4" />
                      Send Message
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
            
            <div id="submit-button-description" className="sr-only">
              Click to submit your contact form. All fields are required.
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
          <Footer />
</div>
    
  )
}

export default ContactForm
