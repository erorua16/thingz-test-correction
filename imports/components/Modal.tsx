import React from 'react'

const Modal = (
  { button, element, borderColor }: { button: any, element: React.ReactElement, borderColor: string }
): React.ReactElement => {

  const [showModal, toggle] = React.useState<boolean>(false)

  return (
    <>
      <button onClick={() => toggle(true)} type="button">
        {button}
      </button>
      <div className={`absolute flex w-full h-full top-20 left-0 ${showModal || 'hidden'}`}>
        <div className={`bg-white z-20 mx-auto mt-8 mb-auto max-w-[80%] min-w-fit max-h-[90%] border-2 rounded-[10px] px-6 py-4 ${borderColor} flex flex-col`}>
          <div className="flex justify-end">
            <button className={'absolute'} type={'button'} onClick={() => toggle(false)}>
              <p className="mt-1 text-4xl text-[#B0B5B7]"> X</p>
            </button>
          </div>
          {element}
        </div>
      </div>
      
    </>
  )
}

export default Modal

  // < Modal borderColor = { borderRed } button = {< Button text = { 'COUCOU'} bg = { bgRed } hover = { hoverBgRed } />} element = {(
  //   <div className='col-flex'>
  //     <h1 className='m-2 font-bold'>POUET</h1>
  //     <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi, consequuntur pariatur quo qui, ullam fugit consequatur hic, nostrum placeat culpa numquam similique! Laudantium expedita eaque provident nisi earum aliquid optio.</p>
  //   </div>
  // )} />
