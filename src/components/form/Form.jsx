import React, { useEffect, useRef, useState } from "react";
import {Modal} from 'antd';
import "./Form.css"

const Form = () => {
    const [isEmail, setIsEmail] = useState(false);
    const [emailValue, setEmailValue] = useState(""); 
    const [isIncorrectDialogVisible, setIsIncorrectDialogVisible] = useState(false);
    const [isCorrectDialogVisible, setIsCorrectDialogVisible] = useState(false);
    const [isTimeoutDialogVisible, setIsTimeoutDialogVisible] = useState(false);
    const [isTimerStop, setIsTimerStop] = useState(false);
    const [inputValue1, setInputValue1] = useState("");
    const [inputValue2, setInputValue2] = useState("");
    const [inputValue3, setInputValue3] = useState("");
    const [inputValue4, setInputValue4] = useState("");
    const [timer, setTimer] = useState("00:00:01");
    const [canRerender, setCanRerender] = useState(false);
    const SECRET_CODE = 5432;
    const [isButtonDisabled, setIsButtonDisabled] = useState(true); 

    const Ref = useRef(null);

    useEffect(() => {
            clearTimer(getDeadTime());
    }, []);

    useEffect(() => {
        if (timer === "00:00:00" && !canRerender && !isTimerStop){
            setIsTimeoutDialogVisible(true);
            setCanRerender(true);
        };
    }, [timer])

    useEffect(() => {
        if(inputValue1 !== '' && inputValue2 !== '' && inputValue3 !== '' && inputValue4 !== ''){
            if(isEmail && emailValue !== ''){
                setIsButtonDisabled(false);
            }
            else{
                setIsButtonDisabled(true);
            }
            if(!isEmail){
                setIsButtonDisabled(false);
            }
        }
        else{
            setIsButtonDisabled(true);
        }
    }, [inputValue1, inputValue2, inputValue3, inputValue4, emailValue, isEmail]);

    const getTimeRemaining = (e) => {
        const total = Date.parse(e) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor(
            (total / 1000 / 60) % 60
        );
        const hours = Math.floor(
            (total / 1000 / 60 / 60) % 24
        );
        return {
            total,
            hours,
            minutes,
            seconds,
        };
    };

    const startTimer = (e) => {
        let { total, hours, minutes, seconds } =
            getTimeRemaining(e);
        if (total >= 0) {
            setTimer(
                (hours > 9 ? hours : "0" + hours) +
                ":" +
                (minutes > 9
                    ? minutes
                    : "0" + minutes) +
                ":" +
                (seconds > 9 ? seconds : "0" + seconds)
            );
        }
    };

    const clearTimer = (e, stop = false) => {
        if(stop == true){
            setTimer("00:00:00");
        }
        else{
            setTimer("00:10:00");
            if (Ref.current) clearInterval(Ref.current);
            const id = setInterval(() => {
                startTimer(e);
            }, 100);
            Ref.current = id;
        }
    };

    const getDeadTime = () => {
        let deadline = new Date();
        deadline.setSeconds(deadline.getSeconds() + 600);
        return deadline;
    };

    const onClickReset = () => {
        clearTimer(getDeadTime());
        setIsTimerStop(false);
        setInputValue1("");
        setInputValue2("");
        setInputValue3("");
        setInputValue4("");
        setEmailValue("");
        setCanRerender(false);
    };

    function jumpToNextInput(x){
        var ml = ~~x.getAttribute('maxlength');
        if(ml && x.value.length >= ml){
            do{
                x = x.nextSibling;
            }
            while(x && !(/text/.test(x.type)));
            if(x && /text/.test(x.type)){
                x.focus();
            }
        }
    }

    const onSubmit = (e) => {
        e.preventDefault();
        let inputValue = [...inputValue1, ...inputValue2, ...inputValue3, ...inputValue4].join("");
        setInputValue1("");
        setInputValue2("");
        setInputValue3("");
        setInputValue4("");
        setEmailValue("");
        if(parseInt(inputValue) === SECRET_CODE){
            setIsCorrectDialogVisible(true);
            setIsTimerStop(true);
        }
        else{
            setIsIncorrectDialogVisible(true);
            setIsTimerStop(true);
            setCanRerender(true);
        }
    }

    const closeModal = () => {
        setIsIncorrectDialogVisible(false);
        setIsCorrectDialogVisible(false);
        setIsTimeoutDialogVisible(false);
    };

    return(
            <div className="form">
                <form className="form__content">
                    <h1>Тестовый банк<br />Подтверждение операции</h1>
                    <div className="form__input">
                            <input type="text"  maxLength={1} placeholder="*" value={inputValue1} onChange={(e) => setInputValue1(prev => /\d+/.test(Number(e.target.value)) ? e.target.value : prev)} autoFocus={true} onInput={e => jumpToNextInput(e.target)} />
                            <input type="text"  maxLength={1} placeholder="*" value={inputValue2} onChange={(e) => setInputValue2(prev => /\d+/.test(Number(e.target.value)) ? e.target.value : prev)} onInput={e => jumpToNextInput(e.target)} />
                            <input type="text"  maxLength={1} placeholder="*" value={inputValue3} onChange={(e) => setInputValue3(prev => /\d+/.test(Number(e.target.value)) ? e.target.value : prev)} onInput={e => jumpToNextInput(e.target)} />
                            <input type="text"  maxLength={1} placeholder="*" value={inputValue4} onChange={(e) => setInputValue4(prev => /\d+/.test(Number(e.target.value)) ? e.target.value : prev)}/>
                    </div>
                    <div className="form__checkbox">
                        <input className="form__receiptCheck" type="checkbox" name="" id="" onChange={(e) => setIsEmail(!isEmail)}/>
                        <label htmlFor="">Отправить чек по email?</label>
                    </div>
                    {isEmail && <input className="form__email" type="email" placeholder="Введите email" value={emailValue} onChange={(e) => setEmailValue(e.target.value)}/>}
                    <div className="form__bottom">
                        {isTimerStop ? <h2>00:00:00</h2> : <h2>{timer}</h2>}
                        <button onClick={(e) => onSubmit(e)} disabled={isButtonDisabled}>Отправить</button>
                    </div>
                </form>
                {canRerender === true && <span className="form__reset" onClick={e => onClickReset()}>Повторить ещё</span>}
                {isIncorrectDialogVisible && <Modal onCancel={closeModal} cancelButtonProps={{ style: { display: 'none' } }} centered={true} title="Ошибка" open={isIncorrectDialogVisible} onOk={closeModal}>Введен неправильный пин-код, нажмите "повторить ещё"</Modal>}
                {isCorrectDialogVisible && <Modal onCancel={closeModal} cancelButtonProps={{ style: { display: 'none' } }} centered={true} title="Успех" open={isCorrectDialogVisible} onOk={closeModal}>Операция подтверждена успешно</Modal>} 
                {isTimeoutDialogVisible && <Modal onCancel={closeModal} cancelButtonProps={{ style: { display: 'none' } }} centered={true} title="Время вышло..." open={isCorrectDialogVisible} onOk={closeModal}>Время закончилось, нажмите "повторить ещё"</Modal>}
            </div>
    )
}

export default Form;