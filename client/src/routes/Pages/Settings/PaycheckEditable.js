import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import actions from '../../../redux/actions/auth';
import axios from "axios";
import CustomEditable from "./CustomEditable";
import validation from "../../../constants/validation";


const PaycheckEditable = () => {
    const dispatch = useDispatch();
    const { payInfo, id } = useSelector(({ auth }) => auth.user )
    const { isWeekly } = payInfo

    const [ week, setWeekly ] = useState(isWeekly)
    const onChange = async e => {
        e.preventDefault()
        try {
            let value = 0;
            if (week === 0) {
                value = 1;
                setWeekly(1);
            } else {
                setWeekly(0);
            }
            const uid = await validation.checkId(id)
            const reqBody = { value, id: uid }
            const { data } = await axios.post('/api/user/update/payFrequency', reqBody)
            dispatch(actions.updateUser(data));
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <CustomEditable 
            label='Pay Frequency'
            value={week}
            onChange={onChange}
        />
    )
    
}

export default PaycheckEditable;