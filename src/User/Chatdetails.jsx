/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import { Fragment, useEffect, useState } from "react";
import React from "react";
import { Label } from "@/components/ui/label";
import { useParams } from "react-router-dom";
import { CheckCircle2, LayoutPanelTop, Send, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Card, CardContent } from "@/components/ui/card";

import { getChatLabels, updateChatLabel } from "@/Service/chat.service";

export default function Chatdetails({ phoneNumber, campaignHistory }) {
  const { id: chatId } = useParams();
  // const [tags, setTags] = useState([]);
  // const [activeTagIndex, setActiveTagIndex] = useState(null);
  // const [isCreateTagOpen, setIsCreateTagOpen] = useState(false);

  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!chatId) {
    return (
      <div className="p-4 w-full flex flex-col h-full items-center justify-center">
        <p className="text-sm  text-center font-semibold mt-1 text-accent-foreground">
          No chat selected. Please select a chat to start messaging.
        </p>
      </div>
    );
  }

  console.log("line number 67");

  useEffect(() => {
    const fetchLabels = async () => {
      setLoading(true);
      try {
        const data = await getChatLabels();
        console.log("Fetched labels line number 75:", data.labels); // Debugging

        if (!Array.isArray(data.labels)) {
          throw new Error("Invalid labels format");
        }

        setLabels([...data.labels]); // Ensure it's an array
      } catch (err) {
        console.error("Error fetching labels:", err);
        setError(err.message);
        setLabels([]); // Ensure labels is always an array
      } finally {
        setLoading(false);
      }
    };

    fetchLabels();
  }, []);

  const handleLabelChange = async (selectedLabel) => {
    if (!chatId) {
      console.error("Chat ID is missing");
      return;
    }

    try {
      await updateChatLabel(chatId, selectedLabel);
      console.log(`Label updated to ${selectedLabel}`);
    } catch (error) {
      console.error("Failed to update label:", error);
    }
  };

  return (
    <Fragment>
      <Card className="  h-full  flex flex-col">
        {/* Sticky Header */}

        <div className="sticky top-0 z-20  p-4 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">
            {" "}
            Chat Details{" "}
          </h2>
        </div>

        {/* add profile */}

        <div className="flex flex-col items-center justify-center text-center border-b p-2">
          <div className="flex justify-center w-12 h-12 border-2 border-blue-500 items-center rounded-full">
            <p className="font-semibold ">{phoneNumber.slice(-2)}</p>
          </div>

          <h3 className="text-xs font-semibold text-gray-900 mt-1">
            {phoneNumber}
          </h3>
        </div>

        {/* Scrollable Content */}

        <div className="flex-1 overflow-auto space-y-4 mt-4">
          <div className="flex flex-col p-4">
            <div className="flex items-center gap-2 mb-2">
              <Send className="w-3 h-3 text-primary" />
              <span className="text-xs font-semibold">Campaign Name: </span>

              <p className="text-xs">
                {campaignHistory?.latest?.campaignName || "Direct Message"}
              </p>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <LayoutPanelTop className="w-3 h-3 text-primary" />
              <span className="text-xs font-semibold">Template Name: </span>
              <p className="text-xs">
                {campaignHistory?.latest?.templateName || "Custom Message"}
              </p>
            </div>

            {/* You can add more fields as needed */}
          </div>

          <Separator />

          <CardContent className="p-4">
            <h2 className="text-md font-semibold mb-2">
              We have a new feature in our chats
            </h2>
            <p className="text-xs text-muted-foreground">
              {phoneNumber} can assign chats to the agents. The agent will
              resolve all your queries and will be available 24/7 for support.
            </p>
          </CardContent>

          <Separator />

          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="mt-2 font-semibold text-black">Quick Action</p>
            {/* Labels Dropdown */}
            <div className="mt-4">
              <Label className="text-sm font-medium">Assign Label</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs mt-2"
                  >
                    Select Label
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {labels.map((label, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={() => handleLabelChange(label)}
                      className="text-xs"
                    >
                      {label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Separator />

          <div className="">
            <div className="p-4">
              <h2 className="text-md font-semibold mb-3">Activity</h2>
              <div className="space-y-3">
                {campaignHistory?.campaigns
                  ?.slice()
                  .reverse()
                  .map((campaign, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 relative"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        </div>
                        {index !== campaignHistory.campaigns.length - 1 && (
                          <div className="w-0.5 h-full bg-border absolute top-8 left-4 -translate-x-1/2" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">
                            {campaign.campaignName || "Campaign Started"}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {campaign.endedAt ? "Completed" : "Ongoing"}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          <strong>Started at:</strong>{" "}
                          {campaign.startedAt
                            ? new Date(campaign.startedAt).toLocaleString()
                            : "Ongoing"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          <strong>Completed at:</strong>{" "}
                          {campaign.endedAt
                            ? new Date(campaign.endedAt).toLocaleString()
                            : "Ongoing"}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Fragment>
  );
}
