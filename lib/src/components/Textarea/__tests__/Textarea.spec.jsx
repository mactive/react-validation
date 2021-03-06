import React from 'react';
import { shallow } from 'enzyme';
import Textarea from './../Textarea';
import rules from './../../../rules';

Object.assign(rules, {
    required: {
        hint() {
            return <span className="error"/>
        }
    }
});

describe('<Textarea/>', () => {
    const register = jest.fn();
    const unregister = jest.fn();
    const validateState = jest.fn();
    const persist = jest.fn();

    const context = {
        register,
        unregister,
        validateState,
        errors: {
            'mock_name': ['required']
        }
    };

    describe('#render', () => {
        it('should render Textarea as is with passed props/attributes', () => {
            const node = shallow(
                <Textarea validations={['mock_validation']} name="mock_name" value="mock_value" />,
                { context }
            );

            expect(node.dive().find('textarea').html()).toBe(`<textarea class="" name="mock_name">mock_value</textarea>`);
        });

        it('should be wrapped by div', () => {
            const node = shallow(
                <Textarea validations={['mock_validation']} name="mock_name" value="mock_value" />,
                { context }
            );

            expect(node.dive().find('textarea').parent().is('div')).toBe(true);
        });

        it('should prefer to render state.value', () => {
            const node = shallow(
                <Textarea validations={['mock_validation']} name="mock_name" value="mock_value" />,
                { context }
            );

            expect(node.dive().find('textarea').get(0).props.value).toBe('mock_value');

            node.setState({
                value: 'mock_other_value'
            });

            expect(node.dive().find('textarea').get(0).props.value).toBe('mock_other_value');
        });

        it('should render without error on unused or unchanged state', () => {
            const node = shallow(
                <Textarea validations={['mock_validation']} name="mock_name" value="" />,
                { context }
            );

            expect(node.dive().find('.error').length).toBe(0);

            node.setState({
                isChanged: true,
                isUsed: false
            });

            expect(node.dive().find('.error').length).toBe(0);

            node.setState({
                isChanged: false,
                isUsed: true
            });
        });

        it('should render with proper error on context with errors and been used & changed', () => {
            const node = shallow(
                <Textarea validations={['mock_validation']} name="mock_name" value="mock_value" />,
                { context }
            );

            node.setState({
                isUsed: true,
                isChanged: true
            });

            expect(node.dive().find('.error').length).toBe(1);
        });

        it('should clear error on context update without error', () => {
            const node = shallow(
                <Textarea validations={['mock_validation']} name="mock_name" value="mock_value" />,
                { context }
            );

            node.setState({
                isUsed: true,
                isChanged: true
            });

            expect(node.dive().find('.error').length).toBe(1);

            node.setContext({
                ...context,
                errors: {}
            });

            expect(node.dive().find('.error').length).toBe(0);
        });
    });

    describe('initial state', () => {
        it('should initialize without error and non changed flag on non passed value', () => {
            const expected = {
                value: '',
                isChanged: false,
                isUsed: false,
                isChecked: true
            };

            const node = shallow(
                <Textarea validations={['mock_validation']} name="mock_name" value="" />,
                { context }
            );

            expect(node.state()).toEqual(expected);
        });

        it('should initialize with changed flag on existing value', () => {
            const expected = {
                value: 'mock_value',
                isChanged: true,
                isUsed: false,
                isChecked: true
            };

            const node = shallow(
                <Textarea validations={['mock_validation']} name="mock_name" value="mock_value" />,
                { context }
            );

            expect(node.state()).toEqual(expected);
        });

        it('should be registered on init', () => {
            shallow(
                <Textarea validations={['mock_validation']} name="mock_name" value="mock_value" />,
                { context }
            );

            expect(register).toHaveBeenCalled();
        });

        it('should be unregistered on unmount', () => {
            const node = shallow(
                <Textarea validations={['mock_validation']} name="mock_name" value="mock_value" />,
                { context }
            );

            node.unmount();

            expect(unregister).toHaveBeenCalled();
        });
    });

    describe('#change', () => {
        it('should set state on change with changed flag and new value', () => {
            const expected = {
                value: 'mock_other_value',
                isChanged: true,
                isUsed: false,
                isChecked: true
            };

            const node = shallow(
                <Textarea validations={['mock_validation']} name="mock_name" value="" />,
                { context }
            );

            node.dive().find('textarea').simulate('change', {
                target: {
                    value: 'mock_other_value'
                },
                persist
            });

            expect(node.state()).toEqual(expected);
        });

        it('should call context.validateState on change', () => {
            const node = shallow(
                <Textarea validations={['mock_validation']} name="mock_name" value="" />,
                { context }
            );

            node.dive().find('textarea').simulate('change', {
                target: {
                    value: 'mock_other_value'
                },
                persist
            });

            expect(validateState).toHaveBeenCalledWith('mock_name');
        });

        it('should persist event on change', () => {
            const node = shallow(
                <Textarea validations={['mock_validation']} name="mock_name" value="" />,
                { context }
            );

            node.dive().find('textarea').simulate('change', {
                target: {
                    value: 'mock_other_value'
                },
                persist
            });

            expect(persist).toHaveBeenCalled();
        });

        it('should call onChange prop if passed', () => {
            const onChange = jest.fn();
            const eventData = {
                target: {
                    value: 'mock_value'
                },
                persist
            };
            const node = shallow(
                <Textarea validations={['mock_validation']} onChange={onChange} name="mock_name" value="" />,
                { context }
            );

            node.dive().find('textarea').simulate('change', eventData);

            expect(onChange).toHaveBeenCalledWith(eventData);
        });
    });

    describe('#blur', () => {
        it('should set state on blur with used flag', () => {
            const expected = {
                value: 'mock_value',
                isChanged: true,
                isUsed: true,
                isChecked: true
            };

            const node = shallow(
                <Textarea validations={['mock_validation']} name="mock_name" value="mock_value" />,
                { context }
            );

            node.dive().find('textarea').simulate('blur', {
                persist
            });

            expect(node.state()).toEqual(expected);
        });

        it('should call context.validateState on blur', () => {
            const node = shallow(
                <Textarea validations={['mock_validation']} name="mock_name" value="" />,
                { context }
            );

            node.dive().find('textarea').simulate('blur', {
                persist
            });

            expect(validateState).toHaveBeenCalledWith('mock_name');
        });

        it('should persist event on blur', () => {
            const node = shallow(
                <Textarea validations={['mock_validation']} name="mock_name" value="" />,
                { context }
            );

            node.dive().find('textarea').simulate('blur', {
                persist
            });

            expect(persist).toHaveBeenCalled();
        });

        it('should call onBlur prop if passed', () => {
            const onBlur = jest.fn();
            const eventData = {
                persist
            };
            const node = shallow(
                <Textarea validations={['mock_validation']} onBlur={onBlur} name="mock_name" value="" />,
                { context }
            );

            node.dive().find('textarea').simulate('blur', eventData);

            expect(onBlur).toHaveBeenCalled();
        });
    });

    describe('update props', () => {
        it('should update state.value and mark changed on updating props with new value', () => {
            const node = shallow(
                <Textarea validations={['mock_validation']} name="mock_name" value="" />,
                { context }
            );

            expect(node.dive().find('textarea').prop('value')).toBe('');

            node.setProps({
                value: 'mock_other_value'
            });

            expect(node.dive().find('textarea').prop('value')).toBe('mock_other_value');
            expect(node.state('isChanged')).toBe(true);
        });

        it('should not update state.value on updating props with same value', () => {
            const node = shallow(
                <Textarea validations={['mock_validation']} name="mock_name" value="mock_value" />,
                { context }
            );

            expect(node.dive().find('textarea').prop('value')).toBe('mock_value');

            node.dive().find('textarea').simulate('change', {
                target: {
                    value: 'mock_other_value'
                },
                persist
            });

            node.setState = jest.fn();

            expect(node.setState).not.toHaveBeenCalled();
        });
    });
});
