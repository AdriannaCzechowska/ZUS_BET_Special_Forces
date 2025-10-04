'use client';

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

interface NavItem {
    label: string;
    icon?: React.ReactNode;
    href?: string;
    onClick?: () => void;
    active?: boolean;
}

interface SideNavProps {
    title: string;
    items: NavItem[];
    children?: React.ReactNode;
    className?: string;
}

export function SideNav({ title, items, children, className }: SideNavProps) {
    return (
        <div className={cn("border-l-4 border-primary", className)}>
            <h3 className="font-headline text-lg font-semibold px-4 pb-2">{title}</h3>
            <nav className="flex flex-col">
                {items.map((item, index) => {
                    const content = (
                        <span className="flex items-center">
                            {item.icon}
                            {item.label}
                        </span>
                    );
                    
                    const commonClasses = "w-full justify-start text-base px-4 py-3 rounded-none";

                    if (item.onClick) {
                        return (
                             <Button 
                                key={index}
                                variant={item.active ? 'default' : 'ghost'}
                                className={cn(
                                    commonClasses, 
                                    !item.active && "text-primary/80 hover:bg-primary/10",
                                )}
                                onClick={item.onClick}
                            >
                                {content}
                            </Button>
                        )
                    }

                    return (
                        <Button 
                            key={index}
                            asChild 
                            variant={item.active ? 'default' : 'ghost'}
                            className={cn(
                                commonClasses, 
                                !item.active && "text-primary/80 hover:bg-primary/10",
                            )}
                        >
                            <Link href={item.href || '#'}>
                                {content}
                            </Link>
                        </Button>
                    )
                })}
                 {children}
            </nav>
        </div>
    )
}
