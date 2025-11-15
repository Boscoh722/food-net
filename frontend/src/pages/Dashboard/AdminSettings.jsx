import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Save, Shield, Bell, UserCog } from "lucide-react";

export default function AdminSettings() {
  const [notifications, setNotifications] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [companyName, setCompanyName] = useState("FoodNet Dashboard");
  const [supportEmail, setSupportEmail] = useState("support@foodnet.com");

  const handleSave = () => {
    console.log("Settings saved:", {
      notifications,
      maintenanceMode,
      companyName,
      supportEmail,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Admin Settings</h1>
      <p className="text-gray-600">Manage system preferences and configuration</p>

      {/* General Settings */}
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <UserCog className="w-5 h-5" />
            <h2 className="text-xl font-semibold">General Settings</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Support Email</Label>
              <Input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Notifications</h2>
          </div>

          <div className="flex items-center justify-between">
            <Label>Enable System Notifications</Label>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Security</h2>
          </div>

          <div className="flex items-center justify-between">
            <Label>Maintenance Mode</Label>
            <Switch
              checked={maintenanceMode}
              onCheckedChange={setMaintenanceMode}
            />
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={handleSave}
        className="flex items-center gap-2 px-6 py-4 rounded-2xl text-lg"
      >
        <Save className="w-5 h-5" /> Save Changes
      </Button>
    </div>
  );
}
