import React from "react";
import { 
    Box,
    Text,
    List,
    ListItem,
    ListIcon,
    Divider,
    Flex,
    Spacer,
} from '@chakra-ui/react'
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import {useSelector} from 'react-redux';
import validation from '../../../constants/validation';

const Overview = () => {
    const userData = useSelector((state) => state.auth.user);
    const monthIncome = validation.getRounded(userData.budget.monthIncome);
    const monthRecurring = validation.getRounded(userData.budget.monthRecurring);
    const monthVariable = validation.getRounded(userData.budget.monthVariable);
    const remaining = validation.getRounded(monthIncome - monthRecurring - monthVariable);

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const d = new Date();

    return (
        <Box
            marginTop={{ base: '1', sm: '5' }}
            marginBottom={{ base: '3', sm: '3' }}
            display="flex"
            flexDirection={{ base: 'column', sm: 'row' }}
            justifyContent="space-between"
            height='auto'>
            <Box
                w={'full'}
                boxShadow={'2xl'}
                rounded={'md'}
                overflow={'hidden'}>
                <Flex bg='white' minWidth='max-content' alignItems='center' gap='2'>
                    <Text px='6' py='2' fontSize={'3xl'} fontWeight={800}>
                        {monthNames[d.getMonth()]}
                    </Text>
                    <Spacer />
                </Flex>
                <Box bg={'rgba(256, 256, 256, .85)'} px={6} py={10}>
                        <List spacing={3}>
                            <ListItem>
                                <Flex>
                                    <Text fontSize={'xl'} fontWeight={800}>
                                        Est. Savings:
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
                </Box>
            </Box>
        </Box>
    )
}

export default Overview;