import React, { useState, useEffect } from "react";
import { Heading,
    Stack,
    Container, 
    SimpleGrid, 
    Box,
    Switch,
    Text,
} from '@chakra-ui/react'
import axios from 'axios';

import Expenses from './Expenses';
import Overview from './Overview';
import Spending from './Spending';
import Chart from './Chart';
import WeeklyOverview from './WeeklyOverview';
import WExpeneses from './WExpenses';
import WSpending from './WSpending';

const Budget = () => {  
    const [budget, setBudget] = useState({})
    const [isWeekly, setIsWeekly] = useState(true);

    const findBudget = async () => {
        const data = await axios.get('/api/calculations/getUserBudget')

        let budgetData = data.data.budget.budget
        setBudget(budgetData)
    }

    useEffect(() => {
        findBudget()
    }, [])

    return (
        <Container maxW={'7xl'} px={[3,3,12,12,12]} py={[0,0,6,6,6]}>
            <Stack direction={'row'} justifyContent={'space-between'}>
                <Heading as="h1">Budget</Heading>
                <Stack align='center' direction={'row'} justifyContent={'space-between'} mb='1'>
                    <Text fontSize={'xl'} fontWeight={500}>Monthly</Text>
                    <Switch colorScheme='purple' size='lg' isChecked={isWeekly} onChange={() => {setIsWeekly(!isWeekly)}
                    }/>
                    <Text fontSize={'xl'} fontWeight={500}>Weekly</Text>
                </Stack>
            </Stack>
            { !isWeekly &&
                <SimpleGrid columns={[1, 1, 2, 2, 2]} spacingX="6" spacingY="0" mb='6'>
                    <Box>
                        <Overview />
                        <Chart />
                    </Box>
                    <Box>
                        <Expenses />
                        <Spending />
                    </Box>
                </SimpleGrid>
            }   
            { isWeekly &&
                <SimpleGrid columns={[1, 1, 2, 2, 2]} spacingX="6" spacingY="0" mb='6'>
                    <Box>
                        <WeeklyOverview/>
                        <Chart />
                    </Box>
                    <Box>
                        <WExpeneses />
                        <WSpending />
                    </Box>
                </SimpleGrid>
            }   
        </Container>
    )
}

export default Budget;