export const screenArtifactExamples = {
    'gigya-register-screen': {
        html: `<div id="gigya-register-screen" class="gigya-screen v2 portrait" data-width="auto" gigya-expression:data-caption="'Welcome! Please Register'">
                 <form class="gigya-register-form" id="gigya-register-form" data-on-success-screen="gigya-complete-registration-screen">
                    <fieldset >
                        <!-- Basic registration form fields -->
                        <input type="text" name="firstName" class="gigya-input-text" placeholder="First Name" required="required">
                        <input type="text" name="lastName" class="gigya-input-text" placeholder="Last Name" required="required">
                        <input type="email" name="email" class="gigya-input-text" placeholder="Email" required="required">
                        <input type="password" name="password" class="gigya-input-password" placeholder="Password" required="required">
                    </fieldset>
                    <fieldset>
                        <input type="submit" value="Register" class="gigya-input-submit">
                    </fieldset>
                </form>
            </div>
           `
    },
    'gigya-complete-registration-screen': {
        html: `<div id="gigya-complete-registration-screen" class="gigya-screen v2 portrait" data-width="auto" gigya-expression:data-caption="'Complete Your Profile'">
                <form class="gigya-complete-registration-form" id="gigya-complete-registration-form">
                    <!-- Completion form fields -->
                    <div class="gigya-layout-row">
                        <input type="text" name="address" class="gigya-input-text" placeholder="Address" required="required">
                    </div>
                    <div class="gigya-layout-row">
                        <input type="submit" value="Complete Registration" class="gigya-input-submit">
                    </div>
                </form>
            </div>`
    },
    'screen-set': {
        html: `<div class="gigya-screen-set" id="Custom-ProgressiveRegistration" data-responsive="true" data-dialog-style="modern">
                 <slot></slot>
                  <style>
                        .gigya-screen-set {
                                font-family: Arial, sans-serif;
                                color: #333;
                            }
                            
                        .gigya-input-text, .gigya-input-password {
                            width: 100%;
                            padding: 10px;
                            margin: 8px 0;
                            display: inline-block;
                            border: 1px solid #ccc;
                            border-radius: 4px;
                            box-sizing: border-box;
                        }
                        
                        .gigya-input-submit {
                            width: 100%;
                            background-color: #6C63FF;
                            /* Purple theme */
                            color: white;
                            padding: 14px 20px;
                            margin: 8px 0;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                        }
                        
                        .gigya-input-submit:hover {
                            background-color: #5a52e0;
                            /* Darker shade for hover */
                        }
                        
                        .input {
                            margin-bottom: 10px;
                        }
                  </style>
              </div>`,

       
    }
}