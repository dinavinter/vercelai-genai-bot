'use client';

import {nanoid} from "nanoid";
import {UserMessage} from "@/components/stocks/message";
import * as React from "react";
import {type AI, UIState} from "@/lib/chat/actions";
import {useActions, useUIState} from "ai/rsc";


export function Examples() {
    // const [messages, setMessages] = useUIState<typeof AI>()\
    const {submitUserMessage     } = useActions()
    const [messages, setMessages] = useUIState<typeof AI>()
    const exampleMessages = [
        {
            heading: 'E-commerce Platform Registration and Checkout',
            subheading:
                'Create a registration and checkout process for an e-commerce platform that collects user preferences, shipping details, and payment information to reduce cart abandonment.',
            message:
                'Create a registration screen for checkout process.'
        },
        {
            heading: 'Membership Sign-ups for Online Platforms',
            subheading:
                'Develop a sign-up process for a membership platform that gathers detailed profile information, preferences, and consent for newsletters and community guidelines.',
            message:
                'Develop a sign-up process for a membership platform.'
        },
        // {
        //   heading: 'Event Registration and Management',
        //     subheading:
        //         'Implement a registration system for events that collects attendee information on sessions of interest, dietary preferences, accommodations, and handles payment for event fees.',
        //     message:
        //         'Implement a registration system for events.'
        // },
        {
            heading: 'Patient Registration for Healthcare Providers',
            subheading:
                'Design a patient registration screen set for healthcare providers to gather medical history, insurance details, and consent forms, integrated with appointment scheduling.',
            message:
                'Design a patient registration screen set for healthcare providers.'
        },
        // {
        //   heading: 'User Onboarding for Software-as-a-Service (SaaS) Products',
        //     subheading:
        //         'Build an onboarding process for a SaaS product that collects information on company size, role-specific features, and sets up initial configurations or integrations.',
        //     message:
        //         'Build an onboarding process for a SaaS product.'
        // },
        // {
        //   heading: 'Financial Services Application Processes',
        //     subheading:
        //         'Set up an application process for financial services, such as loans or credit cards, that requires detailed financial information, identity verification, and risk assessments.',
        //     message:
        //         'Set up an application process for financial services.'
        // },
        // {
        //   heading: 'Educational Course Enrollment',
        //     subheading:
        //         'Create a course enrollment system for educational institutions that collects educational backgrounds, course preferences, and handles payment, offering personalized recommendations.',
        //     message:
        //         'Create a course enrollment system for educational institutions.'
        // },
        {
            heading: 'Loyalty Program Sign-ups for Retail',
            subheading:
                'Develop a loyalty program sign-up process for a retail store that collects customer preferences, purchase history, and marketing consent to offer personalized deals.',
            message:
                'Develop a loyalty program sign-up process for a retail store.'
        },
        {
            heading: 'Feedback and Survey Participation',
            subheading:
                'Implement a detailed feedback and survey system that guides users through questions about products, services, or customer satisfaction, offering incentives for completion.',
            message:
                'Implement a detailed feedback and survey system.'
        },
        {
            heading: 'Custom Content Access Management',
            subheading:
                'Design a content access management system for a media platform that requires users to select content preferences, subscription levels, and content delivery options.',
            message:
                'Design a content access management system for a media platform.'
        }
    ]

    
    const examples =
        exampleMessages.map((example, index) => (
            <div
                key={example.heading}
                className={`cursor-pointer rounded-lg border bg-white p-4 hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 ${
                    index > 1 && 'hidden md:block'
                }`}
                onClick={async () => {
                    setMessages(current => ({
                        ...current,
                        messages:[...current.messages,
                        {
                            id: nanoid(),
                            display: <UserMessage>{example.message}</UserMessage>
                        }]}
                    ))

                    const responseMessage = await submitUserMessage(
                        example.message
                    )

                    setMessages(current => ({
                        ...current,
                        messages:[...current.messages,
                        responseMessage
                    ]}))
                }}
            >
                <div className="text-sm font-semibold">{example.heading}</div>
                <div className="text-sm text-zinc-600">
                    {example.subheading}
                </div>
            </div>
        ))
    return <div className="mb-4 grid grid-cols-2 gap-2 px-4 sm:px-0">
        {examples}
    </div>
}