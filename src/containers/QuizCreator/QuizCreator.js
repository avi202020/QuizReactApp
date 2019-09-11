import React, {Component} from 'react'
import classes from './QuizCreator.css'
import Button from "../../components/UI/Button/Button";
import {createControl, validate, validateForm} from "../../form/formFramework"
import Input from "../../components/UI/Input/Input";
import Select from "../../components/UI/Select/Select";
import {connect} from 'react-redux'
import {createQuizQuestion, finishCreateQuiz} from "../../store/actions/createActions";

function createOptionControl(number) {
    return createControl(
        {
            label: `Variant ${number}`,
            errorMessage: 'Empty variant',
            id: number
        },
        {
            required: true
        }
    )

}

function createFormControls() {
    return {
        question: createControl({
                label: 'Enter question',
                errorMessage: "Question can't be empty"
            },
            {required: true}),
        option1: createOptionControl(1),
        option2: createOptionControl(2),
        option3: createOptionControl(3),
        option4: createOptionControl(4)
    }
}

class QuizCreator extends Component {
    state = {
        touchedBtn: false,
        isFormValid: false,
        rightAnswerId: 1,
        formControls: createFormControls()
    };

    submitHandler = e => {
        e.preventDefault();

    };

    addQuestionHandler = (e) => {
        e.preventDefault();
        if (this.state.isFormValid) {

            const {
                question,
                option1,
                option2,
                option3,
                option4
            } = this.state.formControls;

            const questionItem = {
                question: question.value,
                id: this.props.quiz.length + 1,
                rightAnswerId: this.state.rightAnswerId,
                answers: [
                    {text: option1.value, id: option1.id},
                    {text: option2.value, id: option2.id},
                    {text: option3.value, id: option3.id},
                    {text: option4.value, id: option4.id}
                ]
            };

            this.props.createQuizHandler(questionItem);
            this.setState({
                rightAnswerId: 1,
                formControls: createFormControls()

            })
        } else {
            this.setState({
                isFormValid: false,
                touchedBtn: true
            })
        }


    };

    addQuizHandler = async e => {
        e.preventDefault();
        console.log(this.props.quiz.length);
        if (this.props.quiz.length > 0) {
            try {
                this.props.finishCreateQuiz();
            } catch (error) {
                console.log(error);
            }
        } else {
            console.error("Length quiz array < 1");
            this.setState({
                isFormValid: false,
                touchedBtn: true
            })
        }
    };

    onChangeHandler = (value, controlName) => {
        const formControls = {...this.state.formControls};
        const control = {...formControls[controlName]};
        control.touched = true;
        control.value = value;
        control.valid = validate(control.value, control.validation)

        formControls[controlName] = control;

        this.setState({
            formControls,
            isFormValid: validateForm(formControls)
        })


    };

    renderControls = () => {
        return Object.keys(this.state.formControls).map((controlName, index) => {
                const control = this.state.formControls[controlName];
                return (
                    <React.Fragment key={controlName + index}>
                        <Input
                            type={control.type}
                            value={control.value}
                            valid={control.valid}
                            touched={control.touched}
                            label={control.label}
                            errorMessage={control.errorMessage}
                            onChange={(e) => this.onChangeHandler(e.target.value, controlName)}
                        />
                        {index === 0 ? <hr/> : null}
                    </React.Fragment>

                )
            }
        );
    };

    selectChangeHandler = (e) => {
        let value = this.state.rightAnswerId;
        value = e.target.value;
        this.setState({
            rightAnswerId: value
        })
    };

    render() {
        const select = <Select
            label='Enter valid answer'
            value={this.state.rightAnswerId}
            onChange={this.selectChangeHandler}
            options={[
                {text: 1, value: 1},
                {text: 2, value: 2},
                {text: 3, value: 3},
                {text: 4, value: 4}
            ]}
        />;
        return (
            <div className={classes.QuizCreator}>
                <div>
                    <h1>Quiz create</h1>
                    <form onSubmit={this.submitHandler}>
                        {this.renderControls()}
                        {select}
                        <Button
                            touchedBtn={this.state.touchedBtn}
                            isFormValid={this.state.isFormValid}
                            onClick={this.addQuestionHandler}
                        >
                            Create question
                        </Button>
                        <Button
                            touchedBtn={this.state.touchedBtn}
                            isFormValid={this.state.isFormValid}
                            onClick={this.addQuizHandler}
                        >
                            Create test
                        </Button>
                    </form>
                </div>

            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        quiz: state.create.quiz
    }
}

function mapDispatchToProps(dispatch) {
    return {
        createQuizHandler: item => dispatch(createQuizQuestion(item)),
        finishCreateQuiz: () => dispatch(finishCreateQuiz())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuizCreator);