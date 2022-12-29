import React, {useState, useEffect, useRef} from "react";
import { Heading, 
    Box, 
    Container, 
    Button,
    SimpleGrid, 
    FormControl,
    FormLabel,
    Input,
    HStack,
    FormErrorMessage,
    Select,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Stack,
    ModalFooter,
} from '@chakra-ui/react'
import Balance from "./Balance";
import Shortlist from "./Shortlist";
import { useDispatch, useSelector} from 'react-redux';
import { Formik, Field } from "formik";
import validation from '../../../constants/validation';
import actions from '../../../redux/actions/transactions';
import actions2 from '../../../redux/actions/categories';
import actions3 from '../../../redux/actions/auth';
import axios from 'axios';
import {v4 as uuid} from 'uuid';
import { AddIcon } from '@chakra-ui/icons';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Overview = () => {
    const [startDate, setStartDate] = useState(new Date());
    const startDateFormat = (((startDate.getMonth() > 8) ? (startDate.getMonth() + 1) : ('0' + (startDate.getMonth() + 1))) + '/' + ((startDate.getDate() > 9) ? startDate.getDate() : ('0' + startDate.getDate())) + '/' + startDate.getFullYear());
    const userData = useSelector((state) => state.auth.user);
    const userName = userData.displayName === undefined ? userData.username : userData.displayName;
    const dispatch = useDispatch();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [calendar, setCalendar] = useState(new Date());
    
    const [category, setCategory] = useState("Deposit");
    const [payment, setPayment] = useState("Bank");
    
    const handleChange = (event) => {
        setCategory(event.target.value);
    }

    const handleChange2 = (event) => {
        setPayment(event.target.value)
    }

    const ExampleCustomInput = React.forwardRef(({ value, onClick }, ref) => (
        <Button w='100%' justifyContent='left' className="example-custom-input" onClick={onClick} ref={ref}>
          {value}
        </Button>
    ));

    const fixCalendar = (calendar) => {
        calendar = ((calendar.getMonth() > 8) ? (calendar.getMonth() + 1) : ('0' + (calendar.getMonth() + 1))) + '/' + ((calendar.getDate() > 9) ? calendar.getDate() : ('0' + calendar.getDate())) + '/' + calendar.getFullYear()
        return calendar;
    }

    const sendValues = async (values) => {
        values.id = uuid();
        let date = fixCalendar(calendar);
        values.date = date;
        values.category = category;
        values.payment = payment;
        const reqBody = values;
        await axios.post('/api/calculations/addtransaction', reqBody);
        dispatch(actions.addTransaction(values));
        dispatch(actions3.addTransactionUser(values));
        setCategory('Deposit');
        setPayment("Bank");
        setCalendar(new Date());
        const { data } = await axios.get('/api/user/session');
        dispatch(actions3.updateUser(data));
    }

    const expenses = useSelector((state) => state.categories.categories.expenses);
    const spending = useSelector((state) => state.categories.categories.spending);

    const getData = async () => {

        const getTransactions = async () => {
            const { data } = await axios.get('/api/calculations/getAllTransactions')
            return data
        }
        const getCategories = async () => {
            const { data } = await axios.get('/api/calculations/getAllCategories');
            return data

        }

        const { categories }  = await getCategories();
        dispatch(actions2.setCategories(categories));

        const { transactions } = await getTransactions(); 
        dispatch(actions.setTransactions(transactions));
    }

    useEffect(() => {
        getData();
    },[userData])

    return (
        <Container maxW={'7xl'} px={[3,3,12,12,12]} py={[0,0,6,6,6]}>
            <Stack direction={'row'} justifyContent={'space-between'}>
                <Heading as="h1">Hello {userName}!</Heading>
                <Button
                    onClick={onOpen}
                    bg='black'
                    color='white'
                ><AddIcon color="white"/>
                </Button>   
            </Stack>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent mx='3'>
                <ModalHeader>Add Transaction</ModalHeader>
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
                                            key={'name'}
                                            as={Input}
                                            id="name"
                                            name="name"
                                            type="text"
                                            variant="filled"
                                            validate={(value) => {
                                                let error;
                                                if (!value || typeof value != 'string' || value.trim().length < 3 || value.trim().length > 50) error = "Invalid Name"
                                                return error;
                                            }}
                                        />
                                        <FormErrorMessage>{errors.name}</FormErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={!!errors.amount}>
                                        <FormLabel my={1} htmlFor="amount">Amount</FormLabel>
                                        <Field
                                            as={Input}
                                            key={'amount'}
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
                                <FormLabel my={1} htmlFor="date">Date</FormLabel>
                                <DatePicker
                                    selected={calendar}
                                    onChange={(date) => setCalendar(date)}
                                    customInput={<ExampleCustomInput />}
                                />
                                <FormLabel my={1} htmlFor="category">Category</FormLabel>
                                <Select
                                    value={category}
                                    onChange={handleChange}
                                >
                                    <option value={'Deposit'}>Deposit</option>
                                    {spending.map((s) => {
                                        return(<option key={s.name} value={s.name}>{s.name}</option>);
                                    })}
                                    {expenses.map((e) => {
                                        return(<option  key={e.name} value={e.name}>{e.name}</option>);
                                    })}
                                </Select>
                                <FormLabel my={1} htmlFor="payment">Payment</FormLabel>
                                <Select
                                    value={payment}
                                    onChange={handleChange2}
                                >
                                    <option key={'bank'} value="Bank">{userData.accountInfo.bankName ? userData.accountInfo.bankName : "Bank"}</option>
                                    <option key={'credit'} value="Credit">{userData.accountInfo.creditName ? userData.accountInfo.creditName : "Credit"}</option>
                                </Select>
                                <ModalFooter>
                                    <Button bg={'black'} color={'white'} rounded={'md'} boxShadow={'0 5px 20px 0px black / 43%)'}mx={'auto'} type='submit'>
                                        Submit
                                    </Button>
                                </ModalFooter>
                            </form>
                        )}
                    </Formik>
                </ModalBody>
                </ModalContent>
            </Modal>
            <SimpleGrid columns={[1, null, 2]} spacingX="6" spacingY="0" mb='6'>
                    <Box>
                        <Balance/>
                    </Box>
                    <Box>
                        <Shortlist/>
                    </Box>
            </SimpleGrid>
            
        </Container>
    )
}

export default Overview;