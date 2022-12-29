import React, {useEffect} from "react";
import { 
    Box,
    Text,
    Button,
    List,
    ListItem, 
    Divider,
    Flex,
    Spacer,
    useColorModeValue,
    Center,
} from '@chakra-ui/react'
import { useDispatch, useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom'
import actions from '../../../redux/actions/transactions'
import { MinusIcon } from '@chakra-ui/icons';
import axios from 'axios'
import actions3 from '../../../redux/actions/auth';

const Shortlist = () => {
    const navigate = useNavigate();
    const transactions = useSelector((state) => state.transactions.transactions)
    const dispatch = useDispatch();
    const bg = useColorModeValue('green.50', 'green.900')

    const deleteTransaction = async (id, amount, date, category, payment) => {
        let reqBody = {
            id: id, 
            amount: amount, 
            date: date,
            category: category, 
            payment: payment
        }

        await axios.post('/api/calculations/deletetransaction', reqBody)
        dispatch(actions.deleteTransaction(id))
        let transaction = {
            amount: amount,
            date: date,
            category: category,
            payment: payment,
        }
        dispatch(actions3.deleteTransactionUser(transaction))
    }
    const getData = async (reqBody) => {
        const { data } = await axios.get('/api/calculations/getAllTransactions')
        dispatch(actions.setTransactions(data.transactions))
    }

    useEffect(() => {
        getData()
    }, [])

    const buildTransactions = (transactionList) => {
        return (
            <List spacing={3} w='full'>
                {transactionList.map((t) => {
                    return (
                        <ListItem key={t.id}>
                            <Flex align='center'>
                                <Text fontSize={'3xl'} fontWeight={800}>
                                    {t.name}
                                </Text>
                                <Spacer/>
                                <Text fontSize={'xl'} fontWeight={500}>
                                    {'$' + t.amount}
                                </Text>
                            </Flex>
                            <Flex align='center' mb='2'>
                                <Text
                                    fontSize={'sm'}
                                    fontWeight={500}
                                    bg={bg}
                                    p={2}
                                    mr={3}
                                    color={'green.900'}
                                    rounded={'full'}>
                                    {t.category + ' - ' + t.payment}
                                </Text>
                                <Text
                                    fontSize={'md'}
                                    fontWeight={500}
                                    rounded={'full'}>
                                    {t.date}
                                </Text>
                                <Spacer/>
                                <label htmlFor={t.id}></label>
                                <Button
                                    id={t.id}
                                    width={'5%'}
                                    onClick={(event) => {
                                        deleteTransaction(t.id, t.amount, t.date, t.category, t.payment)
                                    }}
                                    bg='black'
                                >
                                    <MinusIcon color="white"/>
                                </Button>
                            </Flex>
                            <Divider/>
                        </ListItem>
                    )
                })}
            </List>
        )
    }

    return (
        <Box
            marginTop={{ base: '1', sm: '6' }}
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
                        Transactions
                    </Text>
                </Flex>
                <Box bg={'rgba(256, 256, 256, .85)'} px={6} py={10}>
                    <Center>
                        {buildTransactions(transactions.slice(0, 5))}
                    </Center>
                    <Button
                        onClick = {() => navigate('/transactions')}
                        mt={6}
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
                        See All
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}

export default Shortlist;