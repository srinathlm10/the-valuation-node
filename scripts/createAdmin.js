import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Manually parse .env file
const possiblePaths = [
    path.resolve(__dirname, '../.env'),
    path.resolve(__dirname, '.env'),
    path.resolve(process.cwd(), '.env'),
    path.join('D:\\Srinath\\Fin-bot\\fin-bot-india', '.env') // Absolute fallback
];

let envFound = false;
for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
        console.log(`✅ Found .env at: ${p}`);
        const envConfig = fs.readFileSync(p, 'utf-8');
        envConfig.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split('=');
            if (key && valueParts.length > 0) {
                const value = valueParts.join('=').trim();
                process.env[key.trim()] = value.replace(/^["']|["']$/g, '');
            }
        });
        envFound = true;
        break;
    }
}

if (!envFound) {
    console.warn("⚠️  Could not find .env file. searched in:", possiblePaths);
}

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
// Handle cases where SUPABASE_SERVICE_ROLE_KEY might be quoted or have whitespace
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ? process.env.SUPABASE_SERVICE_ROLE_KEY.trim() : undefined;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing API Keys in .env file.');
    console.log('VITE_SUPABASE_URL found:', !!supabaseUrl);
    console.log('SUPABASE_SERVICE_ROLE_KEY found:', !!supabaseServiceKey);
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

const EMAIL = 'srinathguna12@gmail.com';
const PASSWORD = 'Messi@10';

async function createAdmin() {
    console.log(`🚀 Setting up Admin User: ${EMAIL}`);

    try {
        // 1. Try to create the user (or get existing ID if duplicate)
        // admin.createUser auto-confirms the email!
        const { data: userData, error: createError } = await supabase.auth.admin.createUser({
            email: EMAIL,
            password: PASSWORD,
            email_confirm: true,
            user_metadata: {
                full_name: 'Srinath Admin',
                display_name: 'Srinath Admin'
            }
        });

        let userId;

        if (createError) {
            if (createError.message.includes('already registered') || createError.status === 422) {
                console.log('ℹ️  User already exists. Fetching ID...');
                // Fetch user ID by email
                const { data: listData } = await supabase.auth.admin.listUsers();
                const existingUser = listData.users.find(u => u.email === EMAIL);
                if (!existingUser) {
                    throw new Error("Could not find existing user ID even though create failed.");
                }
                userId = existingUser.id;

                // Update password just in case "Invalid Credentials" was due to wrong password
                console.log('🔄 Resetting password to ensure access...');
                await supabase.auth.admin.updateUserById(userId, {
                    password: PASSWORD,
                    email_confirm: true
                });

            } else {
                throw createError;
            }
        } else {
            console.log('✅ User created successfully!');
            userId = userData.user.id;
        }

        console.log(`👤 User ID: ${userId}`);

        // 2. Force Update Role in Profiles table
        // We wait a moment to ensure triggers have fired if it was a new user
        await new Promise(r => setTimeout(r, 2000));

        console.log('👑 Promoting to Admin...');

        // Check if profile exists
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();

        if (!profile) {
            console.log('⚠️  Profile not found (Trigger might have failed). Creating profile manually...');
            const { error: insertError } = await supabase.from('profiles').insert({
                id: userId,
                username: 'admin_srinath',
                display_name: 'Srinath Admin',
                role: 'admin'
            });
            if (insertError) throw insertError;
        } else {
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ role: 'admin' })
                .eq('id', userId);

            if (updateError) throw updateError;
        }

        console.log('✅ SUCCESS! You are now an Admin.');
        console.log('-----------------------------------');
        console.log(`📧 Email:    ${EMAIL}`);
        console.log(`🔑 Password: ${PASSWORD}`);
        console.log('-----------------------------------');
        console.log('👉 Go to: http://localhost:5173/login');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

createAdmin();
