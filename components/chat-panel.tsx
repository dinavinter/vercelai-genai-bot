import * as React from 'react'

import { shareChat } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { PromptForm } from '@/components/prompt-form'
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'
import { IconShare } from '@/components/ui/icons'
import { FooterText } from '@/components/footer'
import { ChatShareDialog } from '@/components/chat-share-dialog'
import { useAIState, useActions, useUIState } from 'ai/rsc'
import type { AI } from '@/lib/chat/actions'
import { nanoid } from 'nanoid'
import { UserMessage } from './stocks/message'

export interface ChatPanelProps {
  id?: string
  title?: string
  input: string
  setInput: (value: string) => void
  isAtBottom: boolean
  scrollToBottom: () => void
}

export function ChatPanel({
  id,
  title,
  input,
  setInput,
  isAtBottom,
  scrollToBottom
}: ChatPanelProps) {
  const [aiState] = useAIState()
  const [messages, setMessages] = useUIState<typeof AI>()
  const { submitUserMessage } = useActions()
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false)
/* create example messages from 1. E-commerce Platform Registration and Checkout
"Create a registration and checkout process for an e-commerce platform that collects user preferences, shipping details, and payment information to reduce cart abandonment."

2. Membership Sign-ups for Online Platforms
"Develop a sign-up process for a membership platform that gathers detailed profile information, preferences, and consent for newsletters and community guidelines."

3. Event Registration and Management
"Implement a registration system for events that collects attendee information on sessions of interest, dietary preferences, accommodations, and handles payment for event fees."

4. Patient Registration for Healthcare Providers
"Design a patient registration screen set for healthcare providers to gather medical history, insurance details, and consent forms, integrated with appointment scheduling."

5. User Onboarding for Software-as-a-Service (SaaS) Products
"Build an onboarding process for a SaaS product that collects information on company size, role-specific features, and sets up initial configurations or integrations."

6. Financial Services Application Processes
"Set up an application process for financial services, such as loans or credit cards, that requires detailed financial information, identity verification, and risk assessments."

7. Educational Course Enrollment
"Create a course enrollment system for educational institutions that collects educational backgrounds, course preferences, and handles payment, offering personalized recommendations."

8. Loyalty Program Sign-ups for Retail
"Develop a loyalty program sign-up process for a retail store that collects customer preferences, purchase history, and marketing consent to offer personalized deals."

9. Feedback and Survey Participation
"Implement a detailed feedback and survey system that guides users through questions about products, services, or customer satisfaction, offering incentives for completion."

10. Custom Content Access Management
"Design a content access management system for a media platform that requires users to select content preferences, subscription levels, and content delivery options."

with the following properties:
- heading: string
- subheading: string  
- message: string
*/
  
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

  return (
    <div className="fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% duration-300 ease-in-out animate-in dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <ButtonScrollToBottom
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />

      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="mb-4 grid grid-cols-2 gap-2 px-4 sm:px-0">
          {messages.length === 0 &&
            exampleMessages.map((example, index) => (
              <div
                key={example.heading}
                className={`cursor-pointer rounded-lg border bg-white p-4 hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 ${
                  index > 1 && 'hidden md:block'
                }`}
                onClick={async () => {
                  setMessages(currentMessages => [
                    ...currentMessages,
                    {
                      id: nanoid(),
                      display: <UserMessage>{example.message}</UserMessage>
                    }
                  ])

                  const responseMessage = await submitUserMessage(
                    example.message
                  )

                  setMessages(currentMessages => [
                    ...currentMessages,
                    responseMessage
                  ])
                }}
              >
                <div className="text-sm font-semibold">{example.heading}</div>
                <div className="text-sm text-zinc-600">
                  {example.subheading}
                </div>
              </div>
            ))}
        </div>

        {messages?.length >= 2 ? (
          <div className="flex h-12 items-center justify-center">
            <div className="flex space-x-2">
              {id && title ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setShareDialogOpen(true)}
                  >
                    <IconShare className="mr-2" />
                    Share
                  </Button>
                  <ChatShareDialog
                    open={shareDialogOpen}
                    onOpenChange={setShareDialogOpen}
                    onCopy={() => setShareDialogOpen(false)}
                    shareChat={shareChat}
                    chat={{
                      id,
                      title,
                      messages: aiState.messages
                    }}
                  />
                </>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <PromptForm input={input} setInput={setInput} />
          <FooterText className="hidden sm:block" />
        </div>
      </div>
    </div>
  )
}
