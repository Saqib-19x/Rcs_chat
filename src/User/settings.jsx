import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/Layout/Layout";
import { getProfile } from "@/Service/auth.service";
import AgentsLayout from "@/Layout/NewLayout";
// Import the update function

export default function Settings() {
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    phone: "",
    company: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      if (response?.user) {
        setProfileData({
          username: response.user.username || "",
          email: response.user.email || "",
          phone: response.user.phone || "",
          company: response.user.company || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle Profile Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await updateProfile(profileData);
      alert("Profile updated successfully! ✅");
      fetchProfile(); // Refresh data after update
    } catch (error) {
      console.error("Profile update failed:", error.message);
      alert("Failed to update profile ❌");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <AgentsLayout>
      <div className="p-1 m-1">
        <h1 className="text-lg font-semibold">Settings</h1>
        <Tabs defaultValue="account" className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Preferences</TabsTrigger>
          </TabsList>

          {/* Account Settings */}
          <TabsContent value="account">
            <Card className="w-full h-full">
              <CardHeader>
                <CardTitle>Your Account</CardTitle>
                <CardDescription>
                  Update your personal information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdate}>
                  <div className="grid w-full text-center gap-4">
                    {/* First Row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col items-start w-full space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          name="username"
                          value={profileData.username}
                          onChange={handleChange}
                          placeholder="Enter username"
                          className="w-full"
                        />
                      </div>

                      <div className="flex flex-col items-start w-full space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          name="company"
                          value={profileData.company}
                          onChange={handleChange}
                          placeholder="Enter company name"
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Second Row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col items-start w-full space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleChange}
                          type="email"
                          placeholder="Enter email"
                          className="w-full"
                        />
                      </div>

                      <div className="flex flex-col items-start w-full space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleChange}
                          type="tel"
                          placeholder="Enter phone number"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                  <CardFooter className="flex justify-end space-x-5 mt-4">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={fetchProfile}
                    >
                      Reset
                    </Button>
                    <Button type="submit" disabled={updating}>
                      {updating ? "Saving..." : "Save"}
                    </Button>
                  </CardFooter>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AgentsLayout>
  );
}
