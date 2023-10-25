import { Box, Flex, Stack, StackDivider, Text } from "@chakra-ui/react";
import React from "react";

interface txnDetails {
  amount: number;
  message: string;
  senderAddress: string;
  timestamp: number;
}

export default function TxnCard({ txn }: { txn: txnDetails[] }) {
  return (
    <>
      {txn.map((item, index) => (
        <Stack divider={<StackDivider bgColor={"gray.500"}/>} key="" spacing="2">
          <Box>
            <Flex alignItems={"center"}>
              <Box>
                <Text fontSize={"md"} color={"gray.700"}><b>From:</b> {item.senderAddress}</Text>
              </Box>
            </Flex>
            <Box justifyContent={"end"} alignContent={"end"} color={"gray.700"}>
              <b>Amount: </b> {item.amount} DOJ
            </Box>
            <Text pt="2" fontSize="md" color={"gray.600"}>
            <b>Message: </b>  {item.message}
            </Text>
          </Box>
          <br></br>
        </Stack>
      ))}
    </>
  );
}