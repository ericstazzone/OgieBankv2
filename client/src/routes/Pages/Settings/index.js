import React from "react";

import { useSelector } from "react-redux";
import { VStack, Heading, Text, Container, Stack, Box, Divider } from "@chakra-ui/react";
import BankNameEditable from "./BankNameEditable";
import BankBalanceEditable from "./BankBalanceEditable";
import CreditNameEditable from "./CreditNameEditable";
import CreditBalanceEditable from "./CreditBalanceEditable";
import CreditLimitEditable from "./CreditLimitEditable";
import FirstNameEditable from "./FirstNameEditable";
import LastNameEditable from "./LastNameEditable";
import EmailEditable from "./EmailEditable";
import UsernameEditable from "./UsernameEditable";


const Settings = () => {
    const { user } = useSelector(({ auth }) => auth )
    
    const ACCOUNT_TYPE = user?.username ? 'OGIE' : 'GOOGLE'

    return (
        <Container maxW={'7xl'} px={[3,3,12,12,12]} py={[0,0,6,6,6]}>
            <Stack direction={'row'} justifyContent={'space-between'}>
                <Heading as="h1">Settings</Heading>
            </Stack>
            <Box
            marginTop={{ base: '1', sm: '6' }}
            marginBottom={{ base: '6', sm: '6' }}
            display="flex"
            flexDirection={{ base: 'column', sm: 'row' }}
            justifyContent="space-between"
            height='auto'>
                <Box
                w={'full'}
                bg={'rgba(256, 256, 256, 0.85)'}
                boxShadow={'2xl'}
                rounded={'md'}
                overflow={'hidden'}>
                    <VStack align={'left'}  px={[6]} py='3'>
                        <Text fontSize={'2xl'}>Profile</Text>
                        {
                            ACCOUNT_TYPE === 'OGIE'
                            ?
                            (
                                <>
                                    <FirstNameEditable />
                                    <LastNameEditable />
                                    <EmailEditable />
                                    <UsernameEditable />
                                </>
                            )
                            :
                            (
                                <>
                                    <Text fontSize='lg' color='gray.600'>
                                        We cannot let you change your Google Account Info from here.
                                        Sorry about that!
                                    </Text>
                                </>
                            )
                        }
                        <Divider/>
                        <Text fontSize={'2xl'}>Account Info</Text>
                        <BankNameEditable />
                        <BankBalanceEditable/>
                        <CreditNameEditable />
                        <CreditBalanceEditable/>
                        <CreditLimitEditable />
                    </VStack>
                </Box>
            </Box>
        </Container>
    )
}

export default Settings;