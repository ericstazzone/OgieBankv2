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

const Home = () => {
    const navigate = useNavigate();

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
                    Test
                </Box>
                <Box bg={'rgba(256, 256, 256, .85)'} px={6} py={10}>
                    Test
                </Box>
            </Box>
        </Box>
    )
}

export default Home;
