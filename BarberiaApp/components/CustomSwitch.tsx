import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Animated, StyleSheet, View } from 'react-native';

interface Props {
    value: boolean;
    onValueChange: (value: boolean) => void;
    activeColor?: string;
    inActiveColor?: string;
}

export const CustomSwitch = ({ value, onValueChange, activeColor, inActiveColor }: Props) => {
   
    const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: value ? 1 : 0,
            duration: 200,
            useNativeDriver: false, 
        }).start();
    }, [value]);

    const translateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [2, 22], 
    });

    const backgroundColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [inActiveColor || '#333', activeColor || '#D4AF37'],
    });

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onValueChange(!value)}
        >
            <Animated.View style={[styles.container, { backgroundColor }]}>
                <Animated.View style={[styles.circle, { transform: [{ translateX }] }]} />
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 46,
        height: 26,
        borderRadius: 13,
        padding: 2,
        justifyContent: 'center',
    },
    circle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#FFFFFF', 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2.5,
        elevation: 3,
    },
});