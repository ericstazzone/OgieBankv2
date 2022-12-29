import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios';

import actions from '../../../redux/actions/transactions'
import actions3 from '../../../redux/actions/auth';

import { 
    Box,
    Divider,
    Text,
    Stack,
    List,
    ListItem,
    Button,
    useColorModeValue, 
    SimpleGrid, 
    Center,
    Select,
    Flex,
    Spacer,
    useDisclosure,
    Heading,
    Container,
} from '@chakra-ui/react'
import { MinusIcon } from '@chakra-ui/icons';

const Transactions = (props) => {
    const transactions = useSelector((state) => state.transactions.transactions)
    const page = useSelector((state) => state.transactions.currentPage)
    const dispatch = useDispatch();
    const bg = useColorModeValue('green.50', 'green.900')

    const [currentPage, setCurrentPage] = useState(0)
    const [selectValue, setSelectValue] = useState('recent')

    const onSelect = (event) => {
        setSelectValue(event.target.value)
        dispatch(actions.sortTransactions(event.target.value))
    }

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

    const onNextPage = () => {
        setCurrentPage(currentPage + 1)
    }

    const onPrevpage = () => {
        setCurrentPage(currentPage - 1)
    }

    const getData = async (reqBody) => {
        const { data } = await axios.get('/api/calculations/getAllTransactions')
        dispatch(actions.setTransactions(data.transactions))
        dispatch(actions.sortTransactions(selectValue))
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
    <Container maxW={'7xl'} px={[3,3,12,12,12]} py={[0,0,6,6,6]}>
        <Stack direction={'row'} justifyContent={'space-between'}>
            <Heading as="h1">Transactions</Heading>
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
                boxShadow={'2xl'}
                rounded={'md'}
                overflow={'hidden'}>
                <SimpleGrid columns={[1]} spacingX="0" spacingY="0" px={6}
                        py={2}
                        bg={'white'}>
                    <Stack
                        textAlign={'center'}
                        px={6}
                        py={3}
                        align={'center'}>
                            <Stack width={'100%'} direction={'row'}>
                                <Select onChange={onSelect} value={selectValue}>
                                    <option value='recent'>Most Recent</option>
                                    <option value='oldest'>Least Recent</option>
                                    <option value='low'>Price Low to High</option>
                                    <option value='high'>Price High to Low</option>
                                </Select>
                            </Stack>
                    </Stack>
                    <Stack
                        direction={'row'}
                        justifyContent={'center'}
                        textAlign={'center'}
                        color={useColorModeValue('gray.800', 'white')}
                        align={'center'}>
                            { currentPage === 0
                            ? ''
                            : <Button 
                                px={6}
                                py={2}
                                onClick={(event) => {
                                    onPrevpage()
                                }}
                                disabled={currentPage === 0}>
                                Prev
                            </Button>
                            }

                            {transactions.slice((currentPage+1)*10, ((currentPage+1)*10) + 10).length === 0
                            ? ''
                            : <Button
                                px={6}
                                py={2}
                                disabled={transactions.slice((currentPage+1)*10, ((currentPage+1)*10) + 10).length === 0}
                                onClick={(event) => {
                                    onNextPage()
                                }}>
                                Next
                            </Button>
                            }
                    </Stack>
                </SimpleGrid>
                <Box bg={'rgba(256, 256, 256, .85)'} px={6} py={10}>
                    <Center>
                    {buildTransactions(transactions.slice(currentPage*10, (currentPage*10) + 10))}
                </Center>
                </Box>
            </Box>
        </Box>
    </Container>
  )
}

export default Transactions