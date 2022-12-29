import React from "react";
import { 
    Box,
    Text,
    List,
    ListItem,
    ListIcon,
    Button,
    Flex,
    Spacer,
    Divider
} from '@chakra-ui/react'
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom'
import {useSelector} from 'react-redux';
import validation from '../../../constants/validation';

const Balance = () => {
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.user);
    const bankName = userData.accountInfo.bankName === '' ? "Add Bank Name In Settings" : userData.accountInfo.bankName;
    const bankBalance = validation.getRounded(userData.accountInfo.bankBalance);
    const creditName = userData.accountInfo.creditName === '' ? "Add Credit Name In Settings" : userData.accountInfo.creditName;
    const creditBalance = validation.getRounded(userData.accountInfo.creditBalance);
    const creditLimit = validation.getRounded(userData.accountInfo.creditLimit);
    const monthIncome = validation.getRounded(userData.budget.monthIncome);
    const monthRecurring = validation.getRounded(userData.budget.monthRecurring);
    const monthVariable = validation.getRounded(userData.budget.monthVariable);
    const remaining = validation.getRounded(monthIncome - monthRecurring - monthVariable);
    const bankBalanceCredit = validation.getRounded(bankBalance - creditBalance);

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const d = new Date();

    return (
        <Box
            marginTop={6}
            display="flex"
            flexDirection={{ base: 'column', sm: 'row' }}
            justifyContent="space-between"
            height='auto'>
            <Box
                w={'full'}
                boxShadow={'2xl'}
                rounded={'md'}
                overflow={'hidden'}>
                <Box px={6} py={[4,4,6,6,6]} bg='white'>
                    <Flex minWidth='max-content' align='center' gap='2' mb={[1,1,3,3,3]}>
                        <Text
                            fontSize={'sm'}
                            fontWeight={500}
                            bg={'green.50'}
                            p={2}
                            px={3}
                            color={'black'}
                            rounded={'full'}>
                            {bankName}
                        </Text>
                        <Spacer />
                        <Text fontSize={'md'}>$</Text>
                        <Text fontSize={'xl'} fontWeight={800}>
                            {bankBalance}
                        </Text>
                        <Text color={'black'}>/ {bankBalanceCredit}</Text>
                    </Flex>
                    <Flex bg='white' minWidth='max-content' align='center' gap='2'>
                        <Text
                            fontSize={'sm'}
                            fontWeight={500}
                            bg={'red.50'}
                            p={2}
                            px={3}
                            color={'black'}
                            rounded={'full'}>
                            {creditName}
                        </Text>
                        <Spacer />
                        <Text fontSize={'md'}>$</Text>
                        <Text fontSize={'xl'} fontWeight={800}>
                            {creditBalance}
                        </Text>
                        <Text color={'black'}>/ {creditLimit}</Text>
                    </Flex>
                </Box>
                <Box bg={'rgba(256, 256, 256, .85)'} px={6} py={10}>
                    <List spacing={3}>
                        <ListItem>
                            <Flex>
                                <Text fontSize={'xl'} fontWeight={800}>
                                 {monthNames[d.getMonth()]}'s Savings:
                                </Text>
                                <Spacer/>
                                <Text fontSize={'xl'} fontWeight={800}>
                                    ${remaining}
                                </Text>
                            </Flex>
                        </ListItem>
                        <Divider/>
                        <ListItem>
                            <Flex align='center'>
                                <ListIcon as={TriangleUpIcon} color="green.400" />
                                Income: 
                                <Spacer/>
                                <Text fontWeight={800}>
                                    ${monthIncome}
                                </Text>
                            </Flex>
                        </ListItem>
                        <ListItem>
                            <Flex align='center'>
                                <ListIcon as={TriangleDownIcon} color="red.400" />
                                Expenses: 
                                <Spacer/>
                                <Text fontWeight={800}>
                                    ${monthRecurring}
                                </Text>
                            </Flex>
                        </ListItem>
                        <ListItem>
                            <Flex align='center'>
                                <ListIcon as={TriangleDownIcon} color="red.400" />
                                Spending:
                                <Spacer/>
                                <Text fontWeight={800}>
                                    ${monthVariable}
                                </Text>
                            </Flex>
                        </ListItem>
                    </List>
                    <Button
                        onClick = {() => navigate('/budget')}
                        mt={10}
                        mx="25%"
                        w={'50%'}
                        bg={'black'}
                        color={'white'}
                        rounded={'md'}
                        boxShadow={'0 5px 20px 0px black / 43%)'}
                        _hover={{
                        bg: 'black',
                        }}
                        _focus={{
                        bg: 'black',
                        }}>
                        View Budget
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}

export default Balance;
