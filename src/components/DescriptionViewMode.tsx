import React from 'react'
import 'react-responsive-modal/styles.css'

export const DescriptionViewMode: React.FC = () => {
  return (
    <div className="space-y-4">
      <p className="text-gray-700">
        閲覧モードは、公開中の旅行プランが第3者にどのように表示されるか確認できるモードです。
        <br />
        公開前のチェックなどにご利用ください。
      </p>
    </div>
  )
}
