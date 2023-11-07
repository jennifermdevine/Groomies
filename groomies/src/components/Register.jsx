// Docs for hot to style this page
// https://supabase.com/docs/guides/auth/auth-helpers/auth-ui#customization

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from "../supabaseClient";
// import { useRouter } from 'next/router'

const Register = () => (
    <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={[
            'google',
            'github',
            'facebook',
            'twitter',
            'magiclink',

        ]}
    />
)

export default Register