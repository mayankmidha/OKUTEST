'use client'

import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { MoreVertical, Eye, Edit2, Shield, Trash2, Mail } from 'lucide-react'

interface ActionMenuProps {
  onView?: () => void
  onEdit?: () => void
  onSecurity?: () => void
  onDelete?: () => void
  onContact?: () => void
}

export function ActionMenu({ onView, onEdit, onSecurity, onDelete, onContact }: ActionMenuProps) {
  return (
    <div className="relative inline-block text-left">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-oku-lavender transition-colors duration-300">
            <MoreVertical className="w-5 h-5 text-oku-taupe" />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-150"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-50 mt-2 w-56 origin-top-right divide-y divide-oku-taupe/5 rounded-3xl bg-white/80 backdrop-blur-xl shadow-premium border border-white focus:outline-none overflow-hidden">
            <div className="px-2 py-2">
              {onView && (
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={onView}
                      className={`${
                        active ? 'bg-oku-lavender text-oku-dark' : 'text-oku-taupe'
                      } group flex w-full items-center rounded-2xl px-4 py-3 text-[11px] font-black uppercase tracking-widest transition-all duration-300`}
                    >
                      <Eye className="mr-3 h-4 w-4" />
                      View Profile
                    </button>
                  )}
                </Menu.Item>
              )}
              {onEdit && (
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={onEdit}
                      className={`${
                        active ? 'bg-oku-glacier text-oku-dark' : 'text-oku-taupe'
                      } group flex w-full items-center rounded-2xl px-4 py-3 text-[11px] font-black uppercase tracking-widest transition-all duration-300`}
                    >
                      <Edit2 className="mr-3 h-4 w-4" />
                      Edit Record
                    </button>
                  )}
                </Menu.Item>
              )}
            </div>
            <div className="px-2 py-2">
              {onContact && (
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={onContact}
                      className={`${
                        active ? 'bg-oku-matcha text-oku-dark' : 'text-oku-taupe'
                      } group flex w-full items-center rounded-2xl px-4 py-3 text-[11px] font-black uppercase tracking-widest transition-all duration-300`}
                    >
                      <Mail className="mr-3 h-4 w-4" />
                      Send Message
                    </button>
                  )}
                </Menu.Item>
              )}
              {onSecurity && (
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={onSecurity}
                      className={`${
                        active ? 'bg-oku-champagne text-oku-dark' : 'text-oku-taupe'
                      } group flex w-full items-center rounded-2xl px-4 py-3 text-[11px] font-black uppercase tracking-widest transition-all duration-300`}
                    >
                      <Shield className="mr-3 h-4 w-4" />
                      Security Audit
                    </button>
                  )}
                </Menu.Item>
              )}
            </div>
            {onDelete && (
              <div className="px-2 py-2">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={onDelete}
                      className={`${
                        active ? 'bg-red-50 text-red-600' : 'text-red-400'
                      } group flex w-full items-center rounded-2xl px-4 py-3 text-[11px] font-black uppercase tracking-widest transition-all duration-300`}
                    >
                      <Trash2 className="mr-3 h-4 w-4" />
                      Restrict Access
                    </button>
                  )}
                </Menu.Item>
              </div>
            )}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}
