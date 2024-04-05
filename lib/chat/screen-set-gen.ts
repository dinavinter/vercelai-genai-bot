import {AnyEventObject, ContextFactory, createMachine} from "xstate";
import {Message} from "@/lib/chat/actions";
import {Spawner} from "xstate/dist/declarations/src/spawn";
import type {MachineSnapshot} from "xstate/dist/declarations/src/State";
import {
    ActorRef,
    AnyActorRef,
    EventObject,
    MachineContext,
    ProvidedActor,
    StateValue
} from "xstate/dist/declarations/src/types";
import {z} from "zod";

const requirmentwriter= `Your task involves interacting with a new client to develop a detailed specification for a Gigya custom screen set they wish to implement. This specification is critical for guiding an AI software developer, emphasizing the necessity for comprehensive details about project functionalities, behaviors, third-party integrations, and more.
                       In your work, follow these important rules:
                    * In your communication with the client, be straightforward, concise, and focused on the task.
                    * Ask questions ONE BY ONE. This is very important, as the client is easily confused. If you were to ask multiple questions the user would probably miss some questions, so remember to always ask the questions one by one
                    * Ask specific questions, taking into account what you already know about the project. For example, don't ask "what features do you need?" or "describe your idea"; instead ask "what is the most important feature?"
                    * Pay special attention to any documentation or information that the project might require (such as accessing a custom API, etc). Be sure to ask the user to provide information and examples that the developers will need to build the proof-of-concept. You will need to output all of this in the final specification.
                    * This is a a prototype project, it is important to have small and well-defined scope. If the scope seems to grow too large (beyond a week or two of work for one developer), ask the user if they can simplify the requirments.
                    * Do not address non-functional requirements (performance, deployment, security, budget, timelines, etc...). We are only concerned with functional and technical specification here.
                    * Do not address deployment or hosting, including DevOps tasks to set up a CI/CD pipeline
                    * Don't address or invision any future development (post proof-of-concept), the scope of your task is to only spec the PoC/prototype.
                    * If the user provided specific information on how to access 3rd party API or how exactly to implement something, you MUST include that in the specification. Remember, the AI developer will only have access to the specification you write.
                    * If the client asks for too complex feature start with mocks and simpler version of the feature, and ask the client if that's okay. If the client insists on the complex feature, you can go with it but notify the client that it will take more time to implement and you will start with the simpler version so you can have a checkup point
                    * Don't address or invision any development requests that are not related to gigya screen set development, the scope of your task is to only spec gigya screen set development.
                    * Always start with the overall flow first, then go into the details of each part of the flow. For example, the application is for retail industry and selling drugs, the flow starts when the user ask for registration, start with email collection, add an auth methods, and then ask for more details,then go into the details of the registration screen fields, the authentication methods to present , the data collection screen fields, etc.
                    
                    * If the user asks for a feature that is not clear, ask for more details. For example, if the user asks for a "login screen", ask if the user wants to use social login, or if the user wants to use email and password, or if the user wants to use both. If the user asks for a "data collection screen", ask what kind of data the user wants to collect, and if the user wants to use autocomplete for the fields, etc.
                    * do not ask for specifics requirement on password, or email validation as it's built with gigya screen set, and gigya will handle the validation
                    * when you come to specify the screen styling and fields, suggest common styling and fields according to the application goal and industry, and ask the user if that's okay. For example, "Let's discuss the details of the register with checkout screen. What information fields should be included on this screen? Typically, it includes fields for Billing Address, Shipping Address, Payment Method, and possibly a Review Order section. Does this align with your requirements?"
                        examples of gathering data chats:
                        """
                    Example 1: Initial Project Description
                    User: We're looking to develop a custom screen set for our new app, focusing on a seamless user registration experience. Could you help us define the specifics?
                    AI Agent: Absolutely, I'd love to help with that. Could you start by telling me more about the primary goal of your app and how the custom screen set fits into this? for example, do you want to integrate the screen in a retail app, a social media app, or a blog app?
                    
                    Example-Set 2: Discussing Authentication Methods
                    AI Agent: To tailor the login process to your needs, could you specify which authentication methods you're considering? For example, are you thinking about including social media logins, email/password, or perhaps a combination?
                    AI Agent: Do you want to include a TFA method collection in the registration screen?
                        AI Agent: Do you want to prompt the user to register a a fingerprint( fiddo / passkey) or face id in the registration screen?
                        AI Agent: Would you want to initiate the flow with a passwordless registration? this will allow the user to register with an otp or passkey first and then set a password later, or skip it.
                        AI Agent: Do you want to have a one identity first screen for both, registration and login,  the user will enter his email and then he will be prompted to register or login, or do you want to have a separate registration and login screen?
                    
                        Example 3: Clarifying the Flow of Screens
                    AI Agent:  After the user have been registered, what should happen next? Should the user be redirected to the home page, or do you want to show a Welcome message?
                        """                                                                                                                                                                                          
                    Ensure that you have all the information about:
                        * overall description and goals for the app
                    * authentication methods to use
                    * flow of the screens
                    * functional specification
                    * how the screen should be triggered
                    * which screens should be involved in the flow
                    * what fields should be present in each screen
                    * any specific requirements for each field (eg. validation, formatting, etc)
                    * overall styling guidelines
                    * popup style or embedded style
                    * enumerate all the parts of the screen flow (eg. registration, login, link accounts, data collection, etc.); for each part, explain *in detail* how it should work from the perspective of the user and when should it be triggered
                    * identify any constraints, business rules, user flows or other important info that affect how the application should integrate with the screen callback
                    * technical specification
                    * what css and js libraries should be used
                    * the architecture of the screens (what js functions should be included, mobile, background tasks, integration with 3rd party services, etc)
                    * any specific requirements for the integration with gigya
                        If you identify any missing information or need clarification on any vague or ambiguous parts of the brief, ask the client about it.
                    
                        Important note: don't ask trivial questions for obvious or unimportant parts of the app, for example:
                    * Bad questions example 1:
                    * Client brief: I want to build a registration screen
                    * Bad questions:
                        * should i use register api?
                    * should the registration screen have a title?
                    * should i use js or css to style the registration screen?
                    * What title do you want for the web page that displays "Register"?
                    * What color and font size would you like for the "Register" text to be displayed in?
                    * Should the "Register" message be static text served directly from the server, or would you like it implemented via JavaScript on the client side?
                    * Explanation: There's no need to micromanage the developer(s) and designer(s), the client would've specified these details if they were important.
                    
                        If you ask such trivial questions, the client will think you're stupid and will leave. DOn'T DO THAT
                    
                    Think carefully about what a developer must know to be able to build the app. The specification must address all of this information, otherwise the AI software developer will not be able to build the app.
                    
                        When you gather all the information from the client, output the complete specification. Remember, the specification should define both functional aspects (features - what it does, what the user should be able to do), the technical details (architecture, technologies preferred by the user, etc), and the integration details (pay special attention to describe these in detail). Include all important features and clearly describe how each feature should function. IMPORTANT: Do not add any preamble (eg. "Here's the specification....") or conclusion/commentary (eg. "Let me know if you have further questions")!
                    
                        Here's an EXAMPLE of a complete specification output. Note that this is just an example, and the actual specification you output should be based on the information you gather from the client. The example is just to give you an idea of the format and level of detail expected in the specification output.:
                    ---start-of-example-output---
                    Project Title: Register Screen Set for Jewellery E-Commerce Website
                    overall: The client wants to implement a Gigya custom screen set for their jewellery e-commerce website. The screen set will involve the following screens: Registration screen, Login screen, Link Accounts screen, Data Collection screen. The overall styling should be clean and modern, and the screens should be displayed as popups. The screen set should be mobile responsive.
                    ## Functional Specification
                    * The screen set should be triggered when the user clicks the "Register" button on the website
                    * The screen set will involve the following screens:
                        * Registration screen
                    * Login screen
                    * Link Accounts screen
                    * Data Collection screen
                    * The Registration screen should have the following fields:
                        * First Name
                    * Last Name
                    * Email
                    * Password
                    * Confirm Password
                    * Data Collection screen should have the following fields:
                        * Address
                    * City
                    * State
                    * What type of jewellery do you like?
                    * Subscribe to newsletter on jewellery design and how to style it best with your outfit
                    * Use autocomplete for the Email, First Name, Last Name, password and confirm password fields
                    * The overall styling should be clean and modern
                    * The screens should be displayed as popups
                    * The Registration screen should be triggered when the user clicks the "Register" button on the website
                    * The Login screen should be triggered when the user clicks the "Login" button on the website, or when the user enters an existing email in the Registration screen
                    * The Link Accounts screen should be triggered when the registration screen triggers link account
                    * The Data Collection screen should be triggered when the user successfully submits the Registration screen
                      
                    Note: after the client reads the specification you create, the client might have additional comments or suggestions. In this case, continue the discussion with the user until you get all the new information and output the newly updated spec again.
`

type Context = {
    spec?: {
        functionality: string;
        assumptions: string;
        technical: string;
    }
    bdds?: {
        scenario: string;
        given: string;
        when: string;
        then: string;
    }[];

    js?: string;
    css?: string;
    html?: string;
    jsonSpec?: string;
    messages: Message[];
    screenSetSpec?: string;
};

type InitialContext = {
    messages: Message[];
};

 
const contextFactory: ContextFactory<Context, ProvidedActor, InitialContext, AnyEventObject> = ({ input: { messages } }) => ({
    messages: messages,
});

export const machine = createMachine({
    context:  contextFactory , 
    id: 'screen-set',
    initial: 'initializing',
  
    states: {
        initializing: {
            on: {
                start: {
                    target: 'understanding-requirements',
                },
            },
            description:
                'The AI agents team is initializing and preparing to start the collaboration process.',
        },
        'understanding-requirements': {
            invoke: {
                src: 'llm',
                input:{
                    prompt: requirmentwriter,
                    context: (context: {userMessages:string[]})=>context.userMessages
                }
            },
            meta: {
                description:
                    'The AI agents are actively chatting with the user to understand the requirements for the project and start generating initial artifacts like screen set spec and BDDs.',
            },
            on: {
                'receive-user-input': {
                    actions: ['logUserMessage', 'processUserInput'],
                },
                'ask-user-question': { 
                    meta:{
                        schema:z.object({
                            question: z.string()
                        })
                    },
                    actions: 'askUserQuestion',
                    
                },
                'update-screen-set-spec': {
                    actions: ['assign.spec', 'updated.spec'],
                    meta:{
                        schema:z.object({
                            functionality: z.string(),
                            assumptions: z.string(),
                            technical: z.string()
                        })
                    },
                    
                },
                'generate-bdds': {
                    actions: ['assign.bdds', 'updated.bdds'] ,
                    meta:{
                        schema:z.object({
                            bdds: z.array(z.object({
                                scenario: z.string(),
                                given: z.string(),
                                when: z.string(),
                                then: z.string()
                            }))
                        })
                    }
                },
                'requirements-understood': {
                    target: 'generating-json-spec',
                },
            },
            description:
                'The AI agents are actively chatting with the user to understand the requirements for the project and start generating initial artifacts like screen set spec and BDDs.',
        },
        'generating-json-spec': {
         
            on: {
                'generate-json-spec': {
                    actions: 'generateJSONSpec',
                },
                'json-spec-generated': {
                    target: 'generating-artifacts',
                },
            },
            description:
                'The AI agents are generating the JSON spec based on the understood requirements.',
        },
        'generating-artifacts': {
            on: {
                'generate-html': {
                    actions: 'generateHTML',
                },
                'generate-js': {
                    actions: 'generateJS',
                },
                'generate-css': {
                    actions: 'generateCSS',
                },
                'all-artifacts-generated': {
                    target: 'visualizing-results',
                },
            },
            description:
                'The AI agents are generating HTML, JS, and CSS artifacts based on the JSON spec and other requirements.',
        },
        'visualizing-results': {
            on: {
                'display-results': {
                    target: 'chatting-with-user',
                },
            },
            description:
                'The AI agents are visualizing the generated artifacts for the user and for each other to review and ensure everything is as required.',
        },
        'chatting-with-user': {
            on: {
                'receive-user-feedback': {
                    actions: ['logUserMessage', 'processUserFeedback'],
                },
                'adjustments-needed': {
                    target: 'updating-artifacts',
                },
                'user-satisfied': {
                    target: 'completed',
                },
            },
            description:
                'The AI agents are discussing the results with the user, gathering feedback, and making necessary adjustments.',
        },
        'updating-artifacts': {
            on: {
                'update-screen-set-spec': {
                    actions: 'updateScreenSetSpec',
                },
                'update-bdds': {
                    actions: 'updateBDDs',
                },
                'update-json-spec': {
                    actions: 'updateJSONSpec',
                },
                'update-html': {
                    actions: 'updateHTML',
                },
                'update-js': {
                    actions: 'updateJS',
                },
                'update-css': {
                    actions: 'updateCSS',
                },
                'updates-completed': {
                    target: 'visualizing-results',
                },
            },
            description:
                'The AI agents are updating the artifacts based on user feedback to meet the requirements accurately.',
        },
        completed: {
            type: 'final',
            description:
                'The AI agents have completed the project, and the user is satisfied with the results.',
        },
    },
} );

export type ScreenSetGenMachine = typeof machine;