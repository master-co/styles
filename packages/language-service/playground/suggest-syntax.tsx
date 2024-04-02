import React from 'react'
import styled from '@master/styled.react'
import clsx from 'clsx'

export const A = () => <div className={`block ${'content:\'123\''}`}>hello world</div>
export const B = () => <div className={clsx('class-a class-b', `class-c class-d
class-d text:center`)}></div>

const Button = styled.button('text:center')