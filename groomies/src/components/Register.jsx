// Docs for hot to style this page
// https://supabase.com/docs/guides/auth/auth-helpers/auth-ui#customization

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from "../supabaseClient";

const Register = () => (
    <Auth
      supabaseClient={supabase}
      localization={{
        variables: {
          sign_in: {
            email_label: 'Your Email Address',
            password_label: 'Your Strong Password',
          },
        },
      }}
    />
  )

export default Register