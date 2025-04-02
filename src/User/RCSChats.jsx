import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import Layout from "@/Layout/Layout";
import { getChatsNumbers } from "@/Service/auth.service";
import { useLocation } from "react-router-dom";

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];

export default function RCSChats() {
  const [chatsLists, setChatsLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation(); // Get current URL

  console.log("Received state in RCSChats 69:", location.state);

  const fetchChatsNumber = async () => {
    try {
      const response = await getChatsNumbers();
      setChatsLists(response || []);
      console.log("Fetched chats:", response);
      console.log(response.length, "line number 72");

      response?.forEach((chat) => {
        console.log(chat.recentMessage?.isRead, "isRead");
      });
    } catch (error) {
      console.error("Error fetching chat data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatsNumber();
  }, []);

  return (
    <>
      {/* table  */}
      <Layout>
        <div>
            
          <div>
            <h1 className="font-semibold">
              {location.state?.type || "RCS"} Chats
            </h1>
          </div>

          <Card className=" m-2 p-2">
            <Table>
              <TableCaption>A list of your recent Chats.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Chats</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.invoice}>
                    <TableCell className="font-medium">
                      {invoice.invoice}
                    </TableCell>
                    <TableCell>{invoice.paymentStatus}</TableCell>
                    <TableCell>{invoice.paymentMethod}</TableCell>
                    <TableCell className="text-right">
                      {invoice.totalAmount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Total Chats</TableCell>
                  <TableCell className="text-right">$2,500.00</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </Card>
        </div>
      </Layout>
    </>
  );
}
