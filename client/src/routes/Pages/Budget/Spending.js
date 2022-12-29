import React, {useEffect} from "react";
import { 
    Box,
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    FormControl,
    FormLabel,
    Input,
    HStack,
    FormErrorMessage,
    List,
    ListItem, 
    Divider,
    Flex,
    Spacer,
} from '@chakra-ui/react'
import { Formik, Field } from "formik";
import {v4 as uuid} from 'uuid';
import { useDispatch, useSelector} from 'react-redux';
import actions from '../../../redux/actions/categories'
import { MinusIcon } from '@chakra-ui/icons';
import axios from 'axios';

const Spending = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const dispatch = useDispatch();

    const sendValues = async (values) => {
        values.id = uuid();
        values.isExpense = false;
        const reqBody = values;
        dispatch(actions.addCategory(reqBody));
        await axios.post('/api/calculations/addcategory', reqBody);
        onClose();
    }

    const deleteSpending = async (id, isExpense) => {
        const reqBody = {
            id: id,
            amount: 1,
            isExpense: isExpense,
        };
        dispatch(actions.deleteCategory(id, isExpense));
        await axios.post('/api/calculations/deletecategory', reqBody);
    }

    const spending = useSelector((state) => state.categories.categories.spending);
    const expenses = useSelector((state) => state.categories.categories.expenses);

    const getData = async (reqBody) => {
        const { data } = await axios.get('/api/calculations/getAllCategories')
        dispatch(actions.setCategories(data.categories));
    }

    useEffect(() => {
        getData();
    },[])

    const checkIfUsed = (name) => {
        let temp = (expenses.some(e => e.name.toLowerCase().trim() === name.toLowerCase().trim()))
        let temp2 = (spending.some(e => e.name.toLowerCase().trim() === name.toLowerCase().trim()))
        if (temp || temp2) return true;
        return false; 
    }

    const barWidth = (balance, amount) => {
        let width = balance / amount * 100;
        if (width > 100) {
            width = 100;
        }
        if (width < 0) {
            width = 0;
        }
        return width;
    }

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
                        Spending
                    </Text>
                    <Spacer />
                </Flex>
                <Box bg={'rgba(256, 256, 256, .85)'} px={6} py={10}>
                    <List spacing={3}>
                    {spending.map((s) => {
                        return (
                            <ListItem key={s.id}>
                                <Flex my="1" justifyContent="space-between" alignContent="center">
                                    <Box
                                        fontSize="xl"
                                        fontWeight="bold">
                                        <label htmlFor={s.name}></label>
                                        <Button
                                            id={s.name}
                                            width={'25%'}
                                            ml={0}
                                            mr={3}
                                            bg='black'
                                            onClick={() => deleteSpending(s.id, s.isExpense)}
                                        >
                                            <MinusIcon color='white'/>
                                        </Button>
                                        {s.name}
                                    </Box>
                                    <Box
                                        fontSize="xl"
                                        fontWeight="bold"
                                        >
                                        ${s.balance} / {s.amount}
                                    </Box>
                                </Flex>
                                <Flex
                                    width="50%"
                                    height="20px"
                                    mx="25%"
                                    my="2"
                                    bg='#f2f0f0'
                                    borderRadius="md"
                                    >
                                    <Flex
                                        // width can be up to 100% based on the balance, if it is 100% then change the color to red
                                        width={barWidth(s.balance, s.amount) + "%"}
                                        height="20px"
                                        borderRadius="md"
                                        bg={barWidth(s.balance, s.amount) === 100 ? "red.500" : "green.500"}
                                        />
                                </Flex>
                                <Divider/>
                            </ListItem>
                        )
                    })}
                    </List>
                    <Modal isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Add Spending</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <Formik
                                    initialValues={{
                                        name: "",
                                        amount: "",
                                    }}
                                    onSubmit={(values, actions) => {
                                        sendValues(values);
                                        actions.setSubmitting(false);
                                        actions.resetForm({
                                            values: {
                                                name: "",
                                                amount: "",
                                            },
                                        });
                                        onClose();
                                    }}
                                    validateOnChange={false}
                                    validateOnBlur={false}
                                >
                                    {({  handleSubmit, errors }) => (
                                    <form onSubmit={handleSubmit}>
                                        <HStack>
                                        <FormControl isInvalid={!!errors.name}>
                                            <FormLabel my={1} htmlFor="name">Name</FormLabel>
                                                <Field
                                                    as={Input}
                                                    id="name"
                                                    name="name"
                                                    type="text"
                                                    variant="filled"
                                                    validate={(value) => {
                                                        let error;
                                                        if (!value || typeof value != 'string' || value.trim().length < 3 || value.trim().length > 50) error = "Invalid Name"
                                                        if (checkIfUsed(value)) error = "Already Used";
                                                        return error;
                                                    }}
                                                />
                                                <FormErrorMessage>{errors.name}</FormErrorMessage>
                                            </FormControl>
                                            <FormControl isInvalid={!!errors.amount}>
                                                <FormLabel my={1} htmlFor="amount">Amount</FormLabel>
                                                <Field
                                                    as={Input}
                                                    id="amount"
                                                    name="amount"
                                                    type="number"
                                                    variant="filled"
                                                    validate={(value) => {
                                                        let error;
                                                        const stringifiedValue = value.toString()
                                                        const strAfterDecimal = stringifiedValue.split('.', 2)[1]
                                                        if (!value || value <= 0 || !Number(value) || value >= 1000000000000000000) error = 'Invalid Amount'
                                                        if (strAfterDecimal && strAfterDecimal.length > 2) error = 'Amount cannot have more than 2 decimals'
                                                        return error;
                                                    }}
                                                />
                                                <FormErrorMessage>{errors.amount}</FormErrorMessage>
                                            </FormControl>
                                        </HStack>
                                        <ModalFooter>
                                            <Button bg={'black'} color={'white'} rounded={'md'} boxShadow={'0 5px 20px 0px black / 43%)'}mx={'auto'} type='submit'>
                                                Add
                                            </Button>
                                        </ModalFooter>
                                    </form>
                                    )}
                                </Formik>
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                    <Button
                        onClick={onOpen}
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
                        Add Spending
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}

export default Spending;