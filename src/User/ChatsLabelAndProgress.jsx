import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useNavigate } from "react-router-dom";

export default function ChatsLabelAndProgress() {

  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);
  const [isTableOn, setIsTableOn] = useState(false);

  const handleClick = (type) => {
    console.log("Navigating with state:", type); // Debugging
    setSelectedType(type);
    setIsTableOn(true);
    navigate("/rcschats", { state: { type } });
  };
  

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">Chats Summary</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>RCS Chats</AccordionTrigger>
              <AccordionContent>
                <div className=" w-full flex flex-col items-start gap-2 p-4 w-64">
                  <button
                    className="flex justify-between w-full px-4 py-2 text-left bg-gray-100 hover:bg-gray-200 hover:underline rounded-lg"
                    onClick={() => handleClick("Total")}
                  >
                    <span>Total Chats:</span>{" "}
                    <span className="font-semibold">0</span>
                  </button>

                  <button
                    className="flex justify-between w-full px-4 py-2 text-left bg-gray-100 hover:bg-gray-200 hover:underline rounded-lg"
                    onClick={() => handleClick("Read")}
                  >
                    <span>Read:</span>{" "}
                    <span className="font-semibold">2</span>
                  </button>

                  <button
                    className="flex justify-between w-full px-4 py-2 text-left bg-gray-100 hover:bg-gray-200 hover:underline rounded-lg"
                    onClick={() => handleClick("Interested")}
                  >
                    <span>Interested:</span>{" "}
                    <span className="font-semibold">2</span>
                  </button>

                  <button
                    className="flex justify-between w-full px-4 py-2 text-left bg-gray-100 hover:bg-gray-200 hover:underline rounded-lg"
                    onClick={() => handleClick("Not Interested")}
                  >
                    <span>Not Interested:</span>{" "}
                    <span className="font-semibold">2</span>
                  </button>

                  <button
                    className="flex justify-between w-full px-4 py-2 text-left bg-gray-100 hover:bg-gray-200 hover:underline rounded-lg"
                    onClick={() => handleClick("Pending")}
                  >
                    <span>Pending:</span>{" "}
                    <span className="font-semibold">2</span>
                  </button>

                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Whatsapp Chats</AccordionTrigger>
              <AccordionContent>
              <div className=" w-full flex flex-col items-start gap-2 p-4 w-64">
                  <button
                    className="flex justify-between w-full px-4 py-2 text-left bg-gray-100 hover:bg-gray-200 hover:underline rounded-lg"
              
                  >
                    <span>Total Chats:</span>{" "}
                    <span className="font-semibold">0</span>
                  </button>

                  <button
                    className="flex justify-between w-full px-4 py-2 text-left bg-gray-100 hover:bg-gray-200 hover:underline rounded-lg"
                  >
                    <span>Read:</span>{" "}
                    <span className="font-semibold">2</span>
                  </button>

                  <button
                    className="flex justify-between w-full px-4 py-2 text-left bg-gray-100 hover:bg-gray-200 hover:underline rounded-lg"
                  >
                    <span>Interested:</span>{" "}
                    <span className="font-semibold">2</span>
                  </button>

                  <button
                    className="flex justify-between w-full px-4 py-2 text-left bg-gray-100 hover:bg-gray-200 hover:underline rounded-lg"
                  >
                    <span>Not Interested:</span>{" "}
                    <span className="font-semibold">2</span>
                  </button>

                  <button
                    className="flex justify-between w-full px-4 py-2 text-left bg-gray-100 hover:bg-gray-200 hover:underline rounded-lg"
                  >
                    <span>Pending:</span>{" "}
                    <span className="font-semibold">2</span>
                  </button>


                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>SMS Chats</AccordionTrigger>
              <AccordionContent>
              <div className=" w-full flex flex-col items-start gap-2 p-4 w-64">
                  <button
                    className="flex justify-between w-full px-4 py-2 text-left bg-gray-100 hover:bg-gray-200 hover:underline rounded-lg"
                  >
                    <span>Total Chats:</span>{" "}
                    <span className="font-semibold">0</span>
                  </button>

                  <button
                    className="flex justify-between w-full px-4 py-2 text-left bg-gray-100 hover:bg-gray-200 hover:underline rounded-lg"
                  >
                    <span>Read:</span>{" "}
                    <span className="font-semibold">2</span>
                  </button>

                  <button
                    className="flex justify-between w-full px-4 py-2 text-left bg-gray-100 hover:bg-gray-200 hover:underline rounded-lg"
                  >
                    <span>Interested:</span>{" "}
                    <span className="font-semibold">2</span>
                  </button>

                  <button
                    className="flex justify-between w-full px-4 py-2 text-left bg-gray-100 hover:bg-gray-200 hover:underline rounded-lg"
                  >
                    <span>Not Interested:</span>{" "}
                    <span className="font-semibold">2</span>
                  </button>

                  <button
                    className="flex justify-between w-full px-4 py-2 text-left bg-gray-100 hover:bg-gray-200 hover:underline rounded-lg"
                  >
                    <span>Pending:</span>{" "}
                    <span className="font-semibold">2</span>
                  </button>


                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>

    </>
  );
}

