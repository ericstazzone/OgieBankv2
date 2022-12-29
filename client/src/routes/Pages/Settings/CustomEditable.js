import React, { useState } from "react";
import { 
    Input, 
    Text,
    FormControl,
    FormLabel,
    ButtonGroup,
    IconButton,
    Flex,
    Spacer,
    Switch,
} from "@chakra-ui/react";

import { 
    CheckIcon, 
    CloseIcon, 
    EditIcon, 
} from '@chakra-ui/icons';

const CustomEditable = ({ label, type, value, onChange, onSubmit, onCancel }) => {
    const [ isEditing, setIsEditing ] = useState(false)

    const startEditing = (event) => {
        event.preventDefault()
        setIsEditing(true)
    }

    const cancelEditing = (event) => {
        event.preventDefault()
        setIsEditing(false)
        onCancel()
    }

    return (
        <form onSubmit={(event) => {
                onSubmit(event)
                setIsEditing(false)
            }
        }>
            <FormControl>
                <FormLabel mt={1} id={`${label}-label`} htmlFor={label} fontWeight={'bold'}>{label}</FormLabel>
                { label === 'Pay Frequency' && 
                    <Flex align='center'>
                        <Text>{value === 1 ? 'Weekly' : 'Bi-Weekly'}</Text> 
                        <Spacer/>
                        <Switch colorScheme='purple' size='lg' isChecked={!value} onChange={onChange}/>
                    </Flex>
                }
                { label !== 'Pay Frequency' &&
                    <Flex align='center'>
                        {
                            isEditing ?
                            (
                                <>
                                    <Input 
                                        id={label} 
                                        type={type} 
                                        value={value} 
                                        onChange={onChange}  
                                        color='gray.600'
                                    />
                                    <Spacer />
                                    <ButtonGroup>
                                        <label htmlFor={`${label}-CheckIcon`}></label>
                                        <IconButton bg='black' icon={<CheckIcon color="white"/>} type='submit' id={`${label}-CheckIcon`}/>
                                        <label htmlFor={`${label}-closeIcon`}></label>
                                        <IconButton bg='black' icon={<CloseIcon color="white"/>} type='button' onClick={cancelEditing} id={`${label}-closeIcon`}/>
                                    </ButtonGroup>                              
                                </>
                                
                            )
                            :
                            (
                                <>
                                    {
                                        typeof(value) === 'string' &&
                                        <Text>{value.trim() ? value.trim() : 'Unassigned Name'}</Text>    
                                    }
                                    {
                                        typeof(value) === 'number' &&
                                        <Text>{value ? value : 'Unassigned Number'}</Text>
                                    }
                                    <Spacer />
                                    <label htmlFor={`${label}-EditIcon`}></label>
                                    <IconButton bg='black' icon={<EditIcon color="white"/>} type='button' onClick={startEditing} id={`${label}-EditIcon`}/>
                                </>

                            )
                        }
                    </Flex>
                }
            </FormControl>
        </form>
        
    )
}

export default CustomEditable;