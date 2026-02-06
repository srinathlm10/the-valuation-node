import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Camera, User } from "lucide-react";

export default function Settings() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        username: "",
        display_name: "",
        bio: "",
        website: "",
    });

    useEffect(() => {
        if (user) {
            getProfile();
        }
    }, [user]);

    async function getProfile() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("profiles")
                .select("username, display_name, bio, website, avatar_url")
                .eq("id", user!.id)
                .single();

            if (error) {
                throw error;
            }

            if (data) {
                setFormData({
                    username: data.username || "",
                    display_name: data.display_name || "",
                    bio: data.bio || "",
                    website: data.website || "",
                });
                setAvatarUrl(data.avatar_url);
            }
        } catch (error) {
            console.error("Error loading profile:", error);
        } finally {
            setLoading(false);
        }
    }

    async function updateProfile(e: React.FormEvent) {
        e.preventDefault();
        try {
            setLoading(true);
            const updates = {
                id: user!.id,
                ...formData,
                avatar_url: avatarUrl,
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase.from("profiles").upsert(updates);

            if (error) throw error;
            toast({
                title: "Profile updated",
                description: "Your profile changes have been saved.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Error updating profile. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }

    async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error("You must select an image to upload.");
            }

            const file = event.target.files[0];
            const fileExt = file.name.split(".").pop();
            const filePath = `${user!.id}/${Math.random()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

            setAvatarUrl(data.publicUrl);

            // Auto-save avatar update
            const { error: updateError } = await supabase
                .from("profiles")
                .upsert({
                    id: user!.id,
                    avatar_url: data.publicUrl,
                    updated_at: new Date().toISOString(),
                });

            if (updateError) throw updateError;

            toast({
                title: "Avatar updated",
                description: "Your profile picture has been updated.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Error uploading avatar",
                variant: "destructive",
            });
        } finally {
            setUploading(false);
        }
    }

    return (
        <Layout>
            <div className="container max-w-2xl py-12">
                <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

                <div className="grid gap-8">
                    {/* Avatar Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Picture</CardTitle>
                            <CardDescription>Click on the image to upload a new one.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-4">
                            <div className="relative group cursor-pointer">
                                <Avatar className="h-24 w-24 border-2 border-border">
                                    <AvatarImage src={avatarUrl || ""} />
                                    <AvatarFallback className="text-lg bg-muted text-muted-foreground">
                                        <User className="h-8 w-8" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="h-6 w-6 text-white" />
                                </div>
                                <Input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    accept="image/*"
                                    onChange={uploadAvatar}
                                    disabled={uploading}
                                />
                            </div>
                            {uploading && <p className="text-sm text-muted-foreground animate-pulse">Uploading...</p>}
                        </CardContent>
                    </Card>

                    {/* Profile Details Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Update your personal details.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={updateProfile} className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" value={user?.email || ""} disabled className="bg-muted" />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        placeholder="johndoe"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="display_name">Display Name</Label>
                                    <Input
                                        id="display_name"
                                        value={formData.display_name}
                                        onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="website">Website</Label>
                                    <Input
                                        id="website"
                                        value={formData.website}
                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                        placeholder="https://example.com"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Textarea
                                        id="bio"
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        placeholder="Tell us a little about yourself"
                                        className="min-h-[100px]"
                                    />
                                </div>

                                <Button type="submit" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Changes
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}
