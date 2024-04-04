/* form schema
  Field:
    classes:
      gigya-hidden: CSS class that is applied to the field when hidden.
      gigya-required-display: TBD

    properties:
      tag:
        type: string
        description: The tag of the field.
        default: input
        enum: [ input, select, textarea ]
      slot:
        type: string
        description: The slot in which the field is placed.
        default: root-field-set

      type:
        type: string
        description: The type of the field.
        default: text
        enum: [ text, email, password, checkbox, radio, select, textarea ]
      name:
        type: string
        description: The name of the field.
      value:
        type: string
        description: The value of the field.
      placeholder:
        type: string
        description: The placeholder of the field.
      autocomplete:
        type: string
        description: The autocomplete of the field.
      data-required:
        type: boolean
        description: When the value is set to "true", the field is required and must be filled in by the user.
      data-valid-checkmark:
        type: boolean
        description: When the value is set to "true", a checkmark is displayed next to the field when the field is valid.
      data-hidden:
        type: boolean
        description: When the value is set to "true", the field is hidden.
 */

import {z} from "zod";


export const field =z.object({  
        tag: z.string().optional().default('input'),
        slot: z.string().optional().default('root-field-set'),
        type: z.enum(['text', 'email', 'password', 'checkbox', 'radio', 'select', 'textarea']),
        name: z.string(),
        value: z.string().optional(),
        placeholder: z.string().optional(),
        autocomplete: z.string().optional(),
        'data-required': z.boolean().optional(),
        'data-valid-checkmark': z.boolean().optional(),
        'data-hidden': z.boolean().optional()
    });
export type Field = z.infer<typeof field>;

export const fields = z.array(field);

export declare type Fields = z.infer<typeof fields>;{