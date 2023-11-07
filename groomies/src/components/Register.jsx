import { Auth } from '@supabase/auth-ui-react'
import {
    // Import predefined theme
    ThemeSupa,
} from '@supabase/auth-ui-shared'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_ANON_KEY
)

const Register = () => (
    <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
    theme="dark"
    />
)

export default Register