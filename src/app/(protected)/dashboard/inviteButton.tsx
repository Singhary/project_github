'use client'

import React, { useState } from 'react'
import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import useProject from '~/hooks/use-project'

const InviteButton = () => {
    const {projectId} = useProject();
    const [open, setOpen] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Invite Team Members
                </DialogTitle>
            </DialogHeader>
            <p className='text-sm text-gray-500'>
                Ask them to copy and paste this Link.
            </p>
            <Input
            className='mt-4'
            onClick={()=> {
                navigator.clipboard.writeText(`${window.location.origin}/join/${projectId}`)
                toast.success('Invite link copied to clipboard')
            }}
            value={`${window.location.origin}/join/${projectId}`}
             readOnly
            />
        </DialogContent>
      </Dialog>

      <Button
      onClick={() => setOpen(true)}
      size="sm"
      >
        Invite Members
      </Button>

    </>
  )
}

export default InviteButton