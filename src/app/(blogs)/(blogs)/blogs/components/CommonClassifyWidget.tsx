import React from 'react';

const CommonClassifyWidget: React.FC = () => {
    return (
        <div className='mobile:h-full h-auto flex flex-col justify-center items-center'>
            <div className='w-full mobile:h-[40px] pc:py-[15px] flex pc:flex-col justify-center items-center gap-3 bg-transparent mobile:text-white border-t-[1px] border-t-[#fff] mobile:border-t-solid'>
                <div className='pc:h-[30px] flex justify-center items-center text-white hover:underline hover:decoration-white hover:cursor-pointer box-border pc:p-2'>ACG</div>
                <div className='pc:h-[30px] flex justify-center items-center text-white hover:underline hover:decoration-white hover:cursor-pointer box-border pc:p-2'>学习</div>
                <div className='pc:h-[30px] flex justify-center items-center text-white hover:underline hover:decoration-white hover:cursor-pointer box-border pc:p-2'>软件</div>
                <div className='pc:h-[30px] flex justify-center items-center text-white hover:underline hover:decoration-white hover:cursor-pointer box-border pc:p-2'>游戏</div>
                <div className='pc:h-[30px] flex justify-center items-center text-white hover:underline hover:decoration-white hover:cursor-pointer box-border pc:p-2'>其他</div>
            </div>
            <div className='w-full mobile:h-[40px] pc:pt-[15px] flex pc:flex-col justify-center items-center gap-3 bg-transparent mobile:text-white border-t-[1px] border-t-[#fff] mobile:border-t-solid'>
                <div className='pc:h-[30px] flex justify-center items-center text-white hover:underline hover:decoration-white hover:cursor-pointer box-border pc:p-2'>RSS</div>
                <div className='pc:h-[30px] flex justify-center items-center text-white hover:underline hover:decoration-white hover:cursor-pointer box-border pc:p-2'>Pixiv</div>
                <div className='pc:h-[30px] flex justify-center items-center text-white hover:underline hover:decoration-white hover:cursor-pointer box-border pc:p-2'>AI女友</div>
                <div className='pc:h-[30px] flex justify-center items-center text-white hover:underline hover:decoration-white hover:cursor-pointer box-border pc:p-2'>魔法喵</div>
                <div className='pc:h-[30px] flex justify-center items-center text-white hover:underline hover:decoration-white hover:cursor-pointer box-border pc:p-2'>归档</div>
                <div className='pc:h-[30px] flex justify-center items-center text-white hover:underline hover:decoration-white hover:cursor-pointer box-border pc:p-2'>关于</div>
                <div className='pc:h-[30px] flex justify-center items-center text-white hover:underline hover:decoration-white hover:cursor-pointer box-border pc:p-2'>留言</div>
            </div>
        </div>
    );
};

export default CommonClassifyWidget;    