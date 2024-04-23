import React from "react";
import "./Header.css"

const Header = ({canRerender}) => {
    let rerender = () => {
        window.location.reload();
    }
    return(
        <div className="header">
                <span class="material-symbols-outlined">
                    account_balance
                </span>
                <h1>Тестовый банк</h1>
        </div>
    )
}

export default Header;